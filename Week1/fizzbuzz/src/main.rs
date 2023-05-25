fn main() {
    println!("Hey, welcome to the FizzBuzz program!");
    fizzbuzz();
}

fn fizzbuzz() {
    let mut fizzbuzz_counter: u8 = 0;

    for i in 0..301 {
        if i % 3 == 0 && i % 5 == 0 {
            println!("fizzbuzz");
            fizzbuzz_counter += 1;
        } else if i % 3 == 0 {
            println!("fizz");
        } else if i % 5 == 0 {
            println!("buzz");
        }
    }

    println!("FizzBuzz counter: {fizzbuzz_counter}");
}