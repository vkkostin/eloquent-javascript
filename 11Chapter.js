function parseExpression(program) {
  // console.log(program)
  program = skipSpace(program);
  var match, expr;
  if (match = /^"([^"]*)"/.exec(program))
    expr = {type: "value", value: match[1]};
  else if (match = /^\d+\b/.exec(program))
    expr = {type: "value", value: Number(match[0])};
  else if (match = /^[^\s(),"]+/.exec(program))
    expr = {type: "word", name: match[0]};
  else
    throw new SyntaxError("Unexpected syntax: " + program);

  return parseApply(expr, program.slice(match[0].length));
}

function skipSpace(string) {
  var first = string.search(/\S/);
  if (first === -1) return "";
  //EXERCISE THREE
  if (string[first] === "#") return skipSpace(string.slice(string.search(/\n/) + 1));
  return string.slice(first);
}

function parseApply(expr, program) {
  program = skipSpace(program);

  //if NOT an application
  if (program[0] !== "(") {
    return {expr, rest: program};
  }

  //if the next character is (
  program = skipSpace(program.slice(1));
  expr = {type: "apply", operator: expr, args: []};
  while (program[0] !== ")") {
    var arg = parseExpression(program);
    expr.args.push(arg.expr);
    program = skipSpace(arg.rest);
    if (program[0] === ",")
      program = skipSpace(program.slice(1));
    else if (program[0] !== ")")
      throw new SyntaxError("Expected ',' or ')'");
  }
  return parseApply(expr, program.slice(1));
}

function parse(program) {
  var result = parseExpression(program);
  if (skipSpace(result.rest).length > 0)
    throw new SyntaxError("Unexpected text after program");
  return result.expr;
}

function evaluate(expr, env) {
  switch(expr.type) {
    case "value": return expr.value;

    case "word":
      if (expr.name in env) {
        return env[expr.name];
      }
      else
        throw new ReferenceError("Undefined variable: " + expr.name);

    case "apply":
      if (expr.operator.type === "word" && expr.operator.name in specialForms) {
        // console.log(expr.operator.name, expr.args, env);
        return specialForms[expr.operator.name](expr.args, env);
      }

      var op = evaluate(expr.operator, env);

      if (typeof op !== "function")
        throw new TypeError("Applying a non-function.");

      // console.log(1, expr.operator, expr.args.map(arg => evaluate(arg, env)));
      return op.apply(null, expr.args.map(arg => evaluate(arg, env)));
  }
}

// SPECIAL FUNCTIONS
var specialForms = Object.create(null);
specialForms["if"] = function(args, env) {
  if (args.length !== 3)
    throw new SyntaxError("Bad number of args to if");

  if (evaluate(args[0], env) !== false)
    return evaluate(args[1], env);
  else
    return evaluate(args[2], env);
};

specialForms["while"] = function(args, env) {
  if (args.length !== 2)
    throw new SyntaxError("Bad number of args to while");

  while (evaluate(args[0], env) !== false)
    evaluate(args[1], env);

  // Since undefined does not exist in Egg, we return false,
  // for lack of a meaningful result.
  return false;
};

specialForms["do"] = function(args, env) {
  var value = false;
  args.forEach(function(arg) {
    value = evaluate(arg, env);
  });
  return value;
};

specialForms["fun"] = function(args, env) {
  if (!args.length)
    throw new SyntaxError("Functions need a body");

  function name(expr) {
    if (expr.type !== "word")
      throw new SyntaxError("Arg names must be words");
    return expr.name;
  }
  var argNames = args.slice(0, args.length - 1).map(name);
  var body = args[args.length - 1];

  return function() {
    if (arguments.length !== argNames.length)
      throw new TypeError("Wrong number of arguments");
    var localEnv = Object.create(env);
    for (var i = 0; i < arguments.length; i++)
      localEnv[argNames[i]] = arguments[i];

    return evaluate(body, localEnv);
  };
};

specialForms["define"] = function(args, env) {
    if (args.length !== 2 || args[0].type !== "word")
        throw new SyntaxError("Bad use of define");

    var value = evaluate(args[1], env);
    env[args[0].name] = value;
    return value;
};

//ENVIRONMENT
var topEnv = Object.create(null);
topEnv["true"] = true;
topEnv["false"] = false;
topEnv["print"] = function(value) {
  console.log(value);
  return value;
};
["+", "-", "*", "/", "==", "<", ">"].forEach(function(op) {
  topEnv[op] = new Function("a, b", `return a ${op} b;`);
});

function run() {
  var env = Object.create(topEnv);
  var program = Array.from(arguments).join("\n");
  return evaluate(parse(program), env);
};

// run("do(define(total, 0),",
//     "   define(count, 1),",
//     "   while(<(count, 11),",
//     "         do(define(total, +(total, count)),",
//     "            define(count, +(count, 1)))),",
//     "   print(total))");
//
// run("do(define(plusOne, fun(a, +(a, 1))),",
//     "   print(plusOne(10)))");
//
// run("do(define(pow, fun(base, exp,",
//     "     if(==(exp, 0),",
//     "        1,",
//     "        *(base, pow(base, -(exp, 1)))))),",
//     "   print(pow(2, 10)))");

//EXERCISE ONE
topEnv["array"] = function() {
  var array = [];
  for (var element in arguments) {
    array.push(arguments[element]);
  }
  return array;
};
topEnv["length"] = function(arr) {
  return arr.length;
};
topEnv["element"] = function(arr, element) {
  return arr[element];
};
// run('print(array(1, 2, 3, 4))');
// run('print(length(array(1, 2, 3, 4)))');
// run('print(element(array(1, 2, 3, 4), 2))')
// run("do(define(sum, fun(array,",
//     "     do(define(i, 0),",
//     "        define(sum, 0),",
//     "        while(<(i, length(array)),",
//     "          do(define(sum, +(sum, element(array, i))),",
//     "             define(i, +(i, 1)))),",
//     "        sum))),",
//     "   print(sum(array(1, 2, 3))))");

//EXERCISE TWO

//EXERCISE THREE
// console.log(parse("# hello\nx"));
// console.log(parse("a # one\n   # two\n()"));

//EXERCISE FOUR
specialForms["set"] = function(args, env) {
  const newValue = env[args[1].name];

  if (!env[args[0].name])
    throw new ReferenceError(`${args[0].name} is not defined`);

  while (env) {
    if (Object.prototype.hasOwnProperty.call(env, args[0].name)) {
      env[args[0].name] = newValue;
    }
    env = Object.getPrototypeOf(env);
  }
};

run("do(define(x, 4),",
    "   define(setx, fun(val, set(x, val))),",
    "   setx(50),",
    "   print(x))");
run("set(quux, true)");
