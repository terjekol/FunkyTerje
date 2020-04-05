/*
sum =  product | sum "+" product | sum "-" product ;
product = term | product "*" term | product "/" term ;
term = "-" term | "(" sum ")" | number ;
*/

var SE = "Syntax Error";

function parse(str) { // returns integer expression result or SE
    var text = str;
    var scan = 1;
    return parse_sum();

    function parse_sum() {
        var number, number2;
        if (number = parse_product() == SE) return SE;
        while (true) {
            skip_blanks();
            if (match("+") {
                number2 = parse_product();
                if (number2 == SE) return SE;
                number += number2;
            }
            else if (match('-')) {
                {
                    number2 = parse_product();
                    if (number2 == SE) return SE;
                    number -= number2;
                } 
             else return number;
            }
        }

        function parse_product() {
            var number, number2;
            if (number = parse_number() == SE) return SE;
            while (true) {
                if (match("*") {
                    number2 = parse_term();
                    if (number2 == SE) return SE;
                    number *= number2;
                }
                else if (match('/')) {
                    number2 = parse_term();
                    if (number2 == SE) return SE;
                    number /= number2;
                }
                else return number;
            }
        }

        function parse_term() {
            var number;
            skip_blanks();
            if (match("(")) {
                number = parse_sum();
                if (number = SE) return SE;
                skip_blanks();
                if (!match(")") return SE;
            }
            else if match("-") {
                number = - parse_term();
            }
            else if (number = parse_number() == SE) return SE;
            return number;
        }

        function skip_blanks() {
            while (match(" ")) { };
            return;
        }

        function parse_number() {
            number = 0;
            if (is_digit()) {
                while (is_digit()) { }
                return number;
            }
            else return SE;
        }

        var number;
        function is_digit() { // following 2 lines are likely wrong in detail but not intent
            if (text[scan] >= "0" && text[scan] <= "9") {
                number = number * 10 + text[scan].toInt();
                return true;
            }
            else return false;
        }

        function match(c) {
            if (text[scan] == c) { scan++; return true }
            else return false;
        }
    }