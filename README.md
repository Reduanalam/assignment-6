 
## 1) What is the difference between `null` and `undefined`?

   undefined
 যখন কোনো ভেরিয়েবল declare করা হয় কিন্তু value assign করা হয় না, তখন তার মান হয় `undefined`।
  

  null
 null মানে  “কোনো মান নেই” সেট করা।
 এটি developer নিজে assign করে।
 

## 2) What is the use of the `map()` function in JavaScript? How is it different from `forEach()`?

  map()
  Array এর প্রতিটি element নিয়ে কাজ করে নতুন একটি array return করে


  forEach()
  শুধু loop করে  কোনো নতুন array return করে না
 

## 3) What is the difference between `==` and `===`?

  `==`  
  শুধু value compare করে Type check করে না


  `===`  
 value এবং type দুটোই check করে


## 4) What is the significance of `async`/`await` in fetching API data?

  API call asynchronous হয়, অর্থাৎ data আসতে সময় লাগে।
  async/await কোডকে সহজ ও readable করে।
  Promise handle করা সহজ হয়।
  Error handling সহজ হয়  ।
 

## 5) Explain the concept of Scope in JavaScript (Global, Function, Block)

  Global Scope
সব জায়গা থেকে access করা যায়।
 
  Function Scope
Function এর ভিতরে declare করা variable বাইরে access করা যায় না।
 
  Block Scope
{} এর ভিতরে declare করা variable শুধু ওই block এ কাজ করে।
  
 