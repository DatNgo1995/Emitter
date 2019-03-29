// Note: The following methods should be exported for Karma tests only

export function off(eName, f) {
  /*throw err if first arg is not string*/
  if (typeof eName != "string") throw new Error("Event name is not a string");
  /*check if 2 argurments are passed*/
  if (arguments.length > 1) {
    /*if second argument is function or array of functions*/
    if (
      typeof f != "function" &&
      !Array.isArray(f) &&
      f.some(e => typeof e != "function")
    )
      throw new Error("second argument is not a function");
    /*
        if second argument is array, loop through the array and global property named after event name
        check if array names are matched, then remove that element in the event array in the property
    */
    if (Array.isArray(f)) {
      f.forEach(e => {
        global[eName].forEach((g, i) => {
          if (g.func !== undefined && e.toString() === g.func.toString())
            global[eName].splice(i, 1);
        });
      });
    }
    /*
        if second argument is function, loop through global property named after event name
        check if array names are matched, then remove that element in the event array in the property   
    */
    if (typeof f === "function") {
      global[eName].forEach((e, i) => {
        if (e.func !== undefined && e.func.toString() === f.toString())
          global[eName].splice(i, 1);
      });
    }
    return global[eName].length;
  }
  /*if there is only one argument passed, check if there is an event matched event name, if yes delete it*/
  if (global[eName]) delete global[eName];
  return 0;
}

/*function on and once is similar, so a function Add is made to shorten the code*/
export function on(eName, f) {
  return Add(eName, f, "no");
}

export function once(eName, f) {
  return Add(eName, f, "yes");
}

export function trigger(eName, ...args) {
  /*throw err if first arg is not string*/
  if (typeof eName != "string") throw new Error("Event name is not a string");
  /*if there is no event with this name, return false*/
  if (!global[eName]) return false;
  /*loop through array of event with given name and execute all function subcribed to that event*/
  global[eName].forEach(e => {
    e.func(...args);
  });
  /*delete the ones that subcribed once*/
  global[eName].forEach((e, i) => {
    if (e.once === "yes") global[eName].splice(i, 1);
  });
  return true;
}

const Add = (eName, f, bool) => {
  /*throw err if first arg is not a string and second arg is not a function*/
  if (typeof eName != "string") throw new Error("Event name is not a string");
  if (typeof f != "function")
    throw new Error("Second argument is not a function");
  /*create new array if the event is new*/
  if (!global[eName]) global[eName] = [];
  /*add function to the event, property "once" specify whether the function subcribes once or not*/
  global[eName].push({ func: f, once: bool });
  return global[eName].length;
};
