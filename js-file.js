// Getting all the necessary selectors 
const operators = document.querySelectorAll('.operator');
const digits = document.querySelectorAll('.digit');
const equal = document.querySelector('#equals');
const output = document.querySelector('#output');
const back = document.querySelector('#back');
const initializer = document.querySelector('#initializer');
const expression = document.querySelector('#expression');
const dot = document.querySelector('#dot');
const buttons = document.querySelectorAll('button');
// initializing variables that are used globally
let oper = "", buffer = "0", answer = "", trim = "", key = 0;

// function for basic operations
function operate(a, operator, b) {
    if (operator === '+') return +a + +b;
    if (operator === '-') return +a - +b;
    if (operator === '*') return +a * +b;
    if (operator === '/') return +a / +b;
    if (operator === '%') return +a % +b;
};

// responding to clicking digit buttons
digits.forEach((digit) => {     
   digit.addEventListener('click', () => {        
       numberInput(digit.value); 
   });                            
});

// function for handling digit input
function numberInput(digit) {
    if (answer != "") { // clearing up all the stuff if input is happening after the caclulation
        expression.textContent = "";
        answer = "";
        output.textContent = "";
        buffer="";
    }
    if (window.screen.width > 2559) {
        if (output.clientWidth > 510) { // limit for the number input due to the fixed screen output size
            return;
        }
    }
    else if (output.clientWidth > 255) { // limit for the number input due to the fixed screen output size
        return;
    }
    if (output.textContent == "ERROR" || output.textContent == "INFINITY") { // clearing up the expressions output for exceptions
        expression.textContent = "";
    }
    if (buffer == '0') { // stopping stacking insignificant zeros
        buffer = digit;
    } else { // adding a digit to the buffer
        buffer += digit;
    }
    output.textContent = buffer; // displaying the input
}

// responding to clicking buttons with operators
operators.forEach((operator) => {     
   operator.addEventListener('click', () => {     
       operatorInput(operator.value);
   });                            
});

// function for handling operators input
function operatorInput(operator) {
    if (answer != "") { // clearing up all the stuff if input is happening after the caclulation
        buffer = `${answer}`;
        answer = "";
        expression.textContent = "";
    } 
    else if (window.screen.width > 2559) {
        if (expression.clientWidth+output.clientWidth/3 > 514) { // checking if adding the number input would breake the borders 
            return; // not adding the number input if it does
        } 
    }
    else if (expression.clientWidth+output.clientWidth/3 > 257) { // checking if adding the number input would breake the borders 
       return; // not adding the number input if it does
    } 
    if (output.textContent == "ERROR" || output.textContent == "INFINITY") { // clearing up the expressions output for exceptions
        expression.textContent = "";
    }
    if (buffer != "") { // adding the number input to the expression's display and clearing the buffer and its output display
        if (buffer.charAt(buffer.length-1) == '.') {
            buffer = buffer.slice(0, buffer.length-1);
        }
        output.textContent = "0";   
        expression.textContent += buffer + ' ' + operator + ' ';
        buffer = "0";
    }
}

// responding to clicking equal button
equal.addEventListener('click', () => {
   calculate();
});

function calculate() {
    if (buffer.charAt(buffer.length-1) == '.') { // deleting an unnecessary dot
        buffer = buffer.slice(0, buffer.length-1);
        output.textContent = buffer;
    }
    if (answer != "") { // clearing up all the stuff if equal's input is happening after the caclulation        
        expression.textContent = output.textContent;
        buffer = output.textContent;
        return; // quiting the function until new input is added
    }
    if (expression.clientWidth + output.clientWidth/2.5 > 236) {  // trimming the expressions display if adding the number would breake the borders 
       str = output.textContent;  
       JSON.stringify(str); // convering an object to string
       out = expression.textContent;  
       JSON.stringify(out); // convering an object to string
       trim = ["... ", out.slice(str.length), buffer].join('');
       key = 1; // assigning the key for applying changes to the expressions display after the calculation is done
    } 
    if (output.textContent == "INFINITY" || output.textContent == "ERROR") { // breaking if exceptional situation just happened
        expression.textContent = output.textContent;
        return;
    }
    expression.textContent += buffer; // adding the buffer to the expressions display
    if (expression.textContent == "") { 
        return; // quiting the function if the expression is empty
    }
    str = expression.textContent;
    let finalExpression = str.split(" "); // conversing a string into an object of numbers and operators

    if (finalExpression.length == 1) { // if operators are missing and only one number is in expressions than it becomes the answer
       answer = buffer; 
       buffer = "";
       return;
    }
    buffer = "";

    // setting the variables of indexes to max possible value for later comparison
    let multInd = finalExpression.length;
    let divInd = finalExpression.length;
    let remInd = finalExpression.length;

    // cycle for calculating multiplication, deletion and remainder operations before addition and subtraction operations
    while(1) {
        if (Object.values(finalExpression).indexOf('*') == -1 && Object.values(finalExpression).indexOf('/') == -1 && Object.values(finalExpression).indexOf('%') == -1) {
           break; // breaking the cycle if no multiplication, deletion and remainder operators are left
        }
        if (Object.values(finalExpression).indexOf('*') != -1) { // checking if multiplication operators are left
           multInd = Object.values(finalExpression).indexOf('*'); // assigning the index of multiplication operation
        }
        if (Object.values(finalExpression).indexOf('/') != -1) { // checking if deletion operators are left
           divInd = Object.values(finalExpression).indexOf('/');  // assigning the index of deletion operation
        }
        if (Object.values(finalExpression).indexOf('%') != -1) { // checking if multiplication operators are left
           remInd = Object.values(finalExpression).indexOf('%'); // assigning the index of remainder operation
        }               
        if (multInd != -1 && multInd < divInd && multInd < remInd) { // checking if found multiplication goes before other operators
           finalExpression = countMultDivRem(finalExpression, multInd) // calculating the operation
        } 
        if (divInd != -1 && divInd < multInd && divInd < remInd) { // checking if found deletion goes before other operators
           if (finalExpression[divInd+1] == 0 && finalExpression[divInd-1] == 0) { // checking for a possible exception
               buffer = "0"; 
               output.textContent = "ERROR";               
               answer = "";
               return;
           }
           if (finalExpression[divInd+1] == 0) { // checking for a possible exception
               buffer = "0";                
               output.textContent = "INFINITY";               
               answer = "";
               return;
           }
           finalExpression = countMultDivRem(finalExpression, divInd) // calculating the operation
        } 
       if (remInd != -1 && remInd < divInd && remInd < multInd) { // checking if found remainder goes before other operators
           if (finalExpression[remInd+1] == 0) {
               buffer = "0"; 
               output.textContent = "ERROR";               
               answer = "";
               return;
           }   
           finalExpression = countMultDivRem(finalExpression, remInd) // calculating the operation
       }

       // setting the variables of indexes to max possible value for later comparison
       multInd = finalExpression.length; 
       divInd = finalExpression.length;
       remInd = finalExpression.length;
   }
   let operationsLeft = (Object.keys(finalExpression).length-1)/2; // calculating how many addition and subtraction operations are left
   for (var i = 0; i < operationsLeft; i++) {
       if (finalExpression.slice(3) != '') { // checking for the final operation
           // decreasing the final expression down to the final answer one operation at a time
           finalExpression = [operate(finalExpression[0], finalExpression[1], finalExpression[2]), finalExpression.slice(3)].join(","); // converting it to a string
           finalExpression = finalExpression.split(","); // and converting it back to an object
       } else {
           finalExpression = [operate(finalExpression[0], finalExpression[1], finalExpression[2])]; // final operation
       }
   }
   answer = finalExpression; // assigning answer for later checks
   output.textContent = answer; // displaying the answer
   if (output.clientWidth > 287) { // if the answer is too long it is turned into an exponential number to fit the calculator display
       answer = (+answer).toExponential();
       answer = (+answer).toPrecision(4);
       output.textContent = answer;
   } 
   if (key == 1) { // applying changes to the expressions display after the calculation is done
       expression.textContent = trim;
       key = 0;
   }
}

function countMultDivRem(finalExpression, index) { // decreasing the final expression down to addition and subtraction operations one at a time
   let result = operate(finalExpression[index-1], finalExpression[index], finalExpression[index+1]); // calculating the result of the operaion
   if (finalExpression.slice(0, index-1) == '' && finalExpression.slice(index+2) == '') { // checking if it was the last operation
       finalExpression = [result]; // and converting it back to an object
   }
   else if (finalExpression.slice(0, index-1) == '' && finalExpression.slice(index+2) != '') { // checking if operation was on the left end
       finalExpression = [result, finalExpression.slice(index+2)].join(","); // converting it into a string to trim
       finalExpression = finalExpression.split(","); // and converting it back to an object
   }
   else if (finalExpression.slice(0, index-1) != '' && finalExpression.slice(index+2) == '') { // checking if operation was on the right end
       finalExpression = [finalExpression.slice(0, index-1), result].join(","); // converting it into a string to trim
       finalExpression = finalExpression.split(","); // and converting it back to an object
   }
   else { // if operation was in the middle
       finalExpression = [finalExpression.slice(0, index-1), result, finalExpression.slice(index+2)].join(","); // converting it into a string to trim
       finalExpression = finalExpression.split(","); // and converting it back to an object
   }  
   return finalExpression;      
}

// responding to clicking backspace button
back.addEventListener('click', () => {
   erase();
});

function erase() { // function for erasing the element
    if (output.textContent == "ERROR" || output.textContent == "INFINITY") { // clearing up the expressions output for exceptions
        expression.textContent = "";
    }
   if (answer != "") { // clearing up all the stuff if input is happening after the caclulation
       buffer = `${answer}`;
       answer = "";
       expression.textContent = "";
   }    
   if (buffer.length > 0) { 
       buffer = buffer.slice(0, -1);
   };
   output.textContent = buffer;
   if (buffer.includes('e')) { // if exponential number is dispayed it is erased completely
       buffer = "0";
       output.textContent = "0";
       answer = "";
       return;
   }
   if (buffer == '') { // if buffer is empty zero is displayed instead
       output.textContent = 0;
       buffer = '0';
   }
}

// responding to clicking initializer button
initializer.addEventListener('click', () => {
   eraseAll();
});

function eraseAll() { // erasing everything
   buffer = "0";
   expression.textContent = "";
   output.textContent = "0";
   answer = "";
}

// responding to clicking dot button
dot.addEventListener('click', () => {
   toFloat();
});


function toFloat() { // adding a dot
   if (answer != "") { // clearing up all the stuff if input is happening after the caclulation
        expression.textContent = "";
        answer = "";
        output.textContent = "0";
        buffer="0";
   }
   if (!buffer.includes('.')) {
        if (output.textContent == "INFINITY" || output.textContent == "ERROR") { 
            expression.textContent = '';
            output.textContent = '0';
            buffer = '0';
        }
        buffer += ".";
        output.textContent += ".";
   }
}

// responding to pressing keys
document.addEventListener('keydown', function(event) { 
   if (event.key == "0" || event.key == "1" || event.key == "2" || event.key == "3" || event.key == "4" || event.key == "5" || event.key == "6" || event.key == "7" || event.key == "8" || event.key == "9" ) {
       numberInput(event.key);
   }
   else if (event.key == "*" || event.key == "/" || event.key == "+" || event.key == "-" || event.key == "%") {
       operatorInput(event.key);
   }
   else if (event.key == "Backspace") {
       erase();
   }
   else if (event.key == ".") {
       toFloat();
   }
   else if (event.key == "=" ) {
       calculate();
   }
});

// creating a button pressing effect after each click by changing border-bottom size and shadow opacity
buttons.forEach((button) => {
   button.addEventListener('click', () => {
       document.getElementById(button.id).style.borderBottomWidth = '3px';
       document.getElementById(button.id).style.boxShadow = "0px 3px 5px rgba(41, 41, 41, 0)";
       setTimeout(function(){
           document.getElementById(button.id).style.borderBottomWidth = '3.5px';
           document.getElementById(button.id).style.boxShadow = "0px 3.5px 5px rgba(41, 41, 41, 0.3)";
       }, 50);
       setTimeout(function(){
           document.getElementById(button.id).style.borderBottomWidth = '5px';
           document.getElementById(button.id).style.boxShadow = "0px 5px 5px rgba(41, 41, 41, 0.6)";
       }, 100);
       setTimeout(function(){
           document.getElementById(button.id).style.borderBottomWidth = '6.5px';
           document.getElementById(button.id).style.boxShadow = "0px 6px 5px rgba(41, 41, 41, 1)";
       }, 150);
   });
});