const response = await fetch("http://localhost:3000/json/**.json");
const data = await response.json();
console.log(await data);
export {};