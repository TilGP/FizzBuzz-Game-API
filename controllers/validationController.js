export const validate = (prev, number, word) => {
    if (number === prev + 1){
        if (number % 3 === 0 && number % 5 === 0 && word.toLowerCase() === "fizzbuzz"){
            return true;
        }else if (number % 3 === 0 && word.toLowerCase() === "fizz"){
            return true;
        }else if (number % 5 === 0 && word.toLowerCase() === "buzz"){
            return true;
        }else if (!word && number % 3 != 0 && number % 5 != 0){
            return true;
        }
        return false;
    }
    return false;

}