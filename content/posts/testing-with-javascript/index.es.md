---
title: ¿Qué es y como podemos probar ("testear") algo?
description: Presionando teclas hasta que algo funcione o deje de funcionar.
date: 2019-10-12
tags: [JavaScript, Programming]
---
Según el diccionario de oxford, _testing_ revela las capacidades de una persona al ponerla bajo
presión, y algunas personas pueden sentir eso acerca de las pruebas en programación.

Las pruebas de software son el proceso para evaluar la funcionalidad de una aplicación para que
podamos obtener los escenarios que podrían conducir a un error molesto para el usuario final o
peor, ser un error millonario. Cumplir con los requisitos de una aplicación realmente grande
puede ser notablemente difícil, y es que quienes escriben la aplicación son humanos,
por lo que es muy fácil llegar a fallar en cualquier momento. 

Todos quieren ofrecer un producto con la mejor calidad y libre de errores a sus clientes,
pero siendo honestos, esto es casi imposible. Tenemos diferentes técnicas para hacerlo
y por el momento hablaré de algunos puntos que siento son mas importantes de los cuales
estoy haciendo/aprendiendo actualmente.

**White Box Testing** y **Black Box Testing** son dos conceptos primordiales en
pruebas de software. El primero se basa en el código de la aplicación mientras
que el segundo evalúa la funcionalidad del software sim mirar el código que lo hace funcionar.

La mayoría de los desarrolladores se centran en _white box testing_ porque son quienes
escriben el código que da funcionalidad a la aplicación. Esto no es algo malo, sin embargo
espero que después de leer este artículo puedas entender por qué creo que ambos son
necesarios y como hacer un equilibrio para obtener una mayor confianza en nuestras pruebas.

Imaginemos que tenemos que desarrollar una calculadora y tenemos el siguiente código:

```js
const sum = (a, b) => a + b;
const add = (a, b) => a - b;
```

Tendremos algunos problemas si usamos esta implementación. No nos importa la solución,
sino cómo podemos obtener ese error antes de liberar el código en producción.

Escribamos una prueba para ello:

```js
const actual = add(21, 2);
const expected = 42;

console.log(actual == expected) // false ╥﹏╥
```

Pero sería bueno tener una mejor manera de saber que hicimos algo mal en lugar de imprimir
en la consola, algo más agresivo:

```js
throw new Error(`${actual} is not equal to ${expected}`);
```

Antes mencioné que necesitamos ejecutar pruebas, así que creemos una forma de ejecutar
más de una prueba.

Primero, vamos a crear una función para envolver la funcionalidad de nuestras pruebas:

```js
function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`${actual} is not equal to ${expected}`);
      }
    }
  };
}
```

Y luego vamos a aislar cada prueba en bloques que contienen un título para que podamos saber
qué prueba es buena o incorrecta:
```js
function test(title, suite) {
  try {
    suite(expect); // we inject our assertion utility
    console.log(`✓ ${title}`);
  } catch (error) {
    console.error(`✕ ${title}`);
    console.error(error);
  }
}
```

Ahora creemos nuestras pruebas:
```js
test("sum function sums numbers", expect => {
  const result = sum(40, 2);
  const expected = 42;

  expect(result).toBe(expected);
  //✓ sum function sums numbers
});

test("add function adds numbers", expect => {
  const result = add(21, 2);
  const expected = 42;

  expect(result).toBe(expected);
  // ✕ add function adds numbers
  // Error: 19 is not equal to 42
});
```

Genial, acabamos de construir algunas pruebas para nuestro módulo de calculadora.
Pero no necesitamos crear estas _librerias_ nosotros mismos. La herramienta mas popular
es [Jest] (https://jestjs.io/), aunque no soy fanático de cómo distribuyen todas sus variables
en el ámbito global. _Jest_ no es la única herramienta, pero si una de las mas completas.

**Unit testing** se centra en los módulos individuales del código fuente mientras que una
**integration test** prueba cómo interactúan estos módulos entre ellos. Las _integration tests_
nos darán más confianza porque se acerca a la implementación real de nuestros módulos.
En nuestro ejemplo aislamos cada caso en diferentes pruebas, haciendo que estos  _unit tests_.
En una aplicación más grande, nos encontraremos con módulos que necesitan de otros para operar
y es cuando los vamos a importar en nuestras pruebas.
También es posible que estos módulos estén usando alguna lógica internamente y vayan a ser
una caja negra para nosotros. Es entonces cuando es hora de usar otro técnica.

Los **mocks** son módulos que reemplazan las dependencias con otros que simulan el comportamiento
de los reales. Supongamos que tenemos servicio API de pago que deseamos probar para 
ver si el usuario puede comprar un producto. A menos que tengas dinero ilimitado,
una _integration test_ sería bueno ya que podemos asegurarnos de que el servicio
está trabajando correctamente. Como no tenemos dinero ilimitado, necesitaremos _mockear_ el servicio
y escribir una _unit test_. Otra razón para usar esto podría ser que el el servicio está caído
o si tenemos algunos problemas con nuestro internet que nos imposibilite usar la implementación real.

Imaginemos que estamos desarrollando un juego para una consola de nueva generación. El juego que
vamos a desarrollar es el super popular "_Rock, Scissors, Paper_":

```js
// choices.js
export default new Map([
  ['rock', 0],
  ['scissors', 1],
  ['paper', 2],
])
```

```js
// game.js
import choices from './choices'
import cpu from './cpu'

export default function game(user){
  const CPU = cpu.choice()
  const results = getWinner(user, CPU)
  if(results < 0){
    return 'Computer Won'
  }
  else if(results > 0){
    return 'You Won'
  }
  return 'Tie'
}

/**
 * Returns 0 if it's a tie. 1 if choice1 beats choice2,
 * and -1 otherwise.
 *  
 * @param {'rock' | 'scissors' | 'paper'} choice1
 * @param {'rock' | 'scissors' | 'paper'} choice2 
 * 
 * @returns {number}
 */
function getWinner(choice1, choice2) {
  let p1 = choices.get(choice1);
  let p2 = choices.get(choice2);

  if (p1 === p2) return 0;

  const nextPos = p1 === choices.size - 1 ? 0 : p1 + 1;

  if (nextPos === p2) return 1;

  return -1;
}
```

Definamos la función `cpu.choice` que nos hace falta:

```js
// cpu.js
import choices from "./choices";

/**
 * @returns {'rock' | 'scissors' | 'paper'}
 */
function choice() {
 return [...choices.keys()][Math.floor(Math.random() * Math.floor(3))];
}

export default { choice };
```

Queremos tener control absoluto de las salidas que esperamos en nuestros tests y esta función
nos hace la vida imposible ya que el resultado es aleatorio cada vez que es ejecutada.

Primero creemos algunas pruebas:
```js
import test from "./test";
import game from "./game";

test("User can win against CPU", expect => {
  const result = game('rock');
  const expected = 'You Won';

  expect(result).toBe(expected);
});

test("User can lose against CPU", expect => {
  const result = game('rock');
  const expected = 'Computer Won';

  expect(result).toBe(expected);
});

test("User can tie against CPU", expect => {
  const result = game('rock');
  const expected = 'Tie';

  expect(result).toBe(expected);
});
```

Lo que estaremos probando es que el usuario pueda ganar, perder o empatar un juego con la computadora.
Por el momento no nos preocuparemos por errores comunes como los tipos de datos que puedan
enviarse erroneamente a las funciones que destruirían nuestro código, esto para que nuestro ejemplo
sea sencillo de seguir.

Si ejecutamos estas pruebas nos encontraremos con diferentes resultados ya que la computadora
elegirá aleatoriamente una opción en cada juego. Eso es malo para nuestras pruebas ya que no
hay manera de evaluar los resultados con lo esperado.

El modulo que vamos a convertir en _mock_ es _cpu.js_. Lo que queremos hacer es sobreescribir
la lógica en la función `choice`. Para ello usaremos la técnica conocida como **monkey-patching**.
Según la wikipedia, _monkey patch_ es una manera de extender o modificar un programa localmente
afectando unicamente la instancia donde es ejecutada.

_**Precaución**: El siguiente código implica que al ejecutar las pruebas, éstas se transformen a common js._

Procedamos a crear y usar nuestro _mock_:
```js
test("User can win against CPU", expect => {
  cpu.choice = () => {
    return 'scissors'
  };

  const result = game("rock");
  const expected = "You Won";

  expect(result).toBe(expected);
});
```

Si hacemos esto en todos nuestros tests, todo funcionará y podremos ver nuestras pruebas pasar
exitósamente. Pero tener que hacer esto cada vez es algo tedioso y podemos olvidar el cambiar
la funcionalidad en otras pruebas, o peor, quizá necesitamos la implementación original en
otras pruebas por lo que necesitaríamos salvar la función original para regresarlo a su valor
inicial una vez que terminemos nuestras pruebas. Creo que puedes imaginar cuán grande podría
ser el problema.

Aquí estamos haciendo un poco de trampa. Como lo mencioné en la precaución anterior, estoy asumiendo
que este código se transformará a módulos _common js_. En módulos _ES_ esto no es tan fácil por su
naturalidad. Habiendo dicho esto, una mejor solución sería usar alguna librería de _mocking_.
Pero, ¿adivina qué? _Jest_ también cuenta con esta utilidad entre sus herramientas y es fácil de
utilizar. Vamos a deshacernos de nuestra implementación de _testing framework_ y utilicemos _Jest_
en su lugar.

```js
// src/__tests__/game.test.js
import game from "../game.js";
import cpu from "../cpu.js";

jest.mock("../cpu", () => {
  return {
    choice: jest.fn()
  };
});

// We're going to return these choices in sequential order
beforeEach(() => {
  cpu.choice
    .mockReturnValueOnce("rock")
    .mockReturnValueOnce("scissors")
    .mockReturnValueOnce("paper");
});

test("User can win against CPU", () => {
  ["paper", "rock", "scissors"].forEach(option => {
    const result = game(option);
    const expected = "You Won";

    expect(result).toBe(expected);
  });
});

test("User can lose against CPU", () => {
  ["scissors", "paper", "rock"].forEach(option => {
    const result = game(option);
    const expected = "Computer Won";

    expect(result).toBe(expected);
  });
});

test("User can tie against CPU", () => {
  ["rock", "scissors", "paper"].forEach(option => {
    const result = game(option);
    const expected = "Tie";

    expect(result).toBe(expected);
  });
});
```

Observa cómo nuestro _testing framework_ es muy similar a **Jest**. Podemos deshacernos
y lo único que cambiamos es que las funciones `test` y `expect` forman parte del ámbito global.
Algo que no me gusta mucho pero es algo que entiendo ya que importarlos en cada prueba
puede ser muy cansado. La función `jest.mock` _mockeará_ el módulo entero y podremos
cambiar su implementación para obtener las diferentes opciones que la computadora
puede tomar, haciéndonos la vida mucho mas sencilla para probar todas las implementaciones.

En el mundo del _testing_, el estado de cada prueba que se puede configurar antes o
después de que las ejecutamos, se llaman **fixtures**. Un ejemplo muy común es cuando
tus pruebas requieran de una conexión a la base de datos. Antes de tus pruebas debes
de crear la conexión y cerrarla.

Y eso es todo por el momento. Ahora que he establecido los conceptos básicos en esta publicación,
me gustaría agregar algunas técnicas sobre cómo hacer mejores pruebas y cómo podemos evitar
algunos de los problemas más comunes. Ten en cuenta qué es lo que necesitas probar y,
si no hay otra manera, crear _mocks_ para aquellos módulos que estén fuera de nuestras manos.