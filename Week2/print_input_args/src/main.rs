use std::env;
use std::io;

fn main() {
    print_input_args();
}

// fn print_input_args() {
//     let args: Vec<String> = env::args().collect();

//     while args.len() <= 3 {
//         println!("Input 3 arguments:");
//         return;
//     };

//     println!("{args:?}");
// }

// I love the 2nd variant with io more than with args.

fn print_input_args() {
    let mut inputs = Vec::new();

    for _ in 0..3 {
        let mut input = String::new();
        io::stdin().read_line(&mut input).expect("Failed to read input");
        inputs.push(input.trim().to_string());
    }

    for (index, string) in inputs.iter().enumerate() {
        println!("{}: {}", index + 1, string);
    }
}