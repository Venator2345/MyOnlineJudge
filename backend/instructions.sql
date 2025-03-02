CREATE TABLE exercises (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(500) NOT NULL,
    example_input VARCHAR(255) NOT NULL,
    example_output VARCHAR(255) NOT NULL,
    example_input2 VARCHAR(255),
    example_output2 VARCHAR(255)
);

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE attempt (
    id INT PRIMARY KEY AUTO_INCREMENT,
    result VARCHAR(3) NOT NULL,
    user_code TEXT NOT NULL,
    user_id INT NOT NULL,
    exercise_id INT NOT NULL,
    language VARCHAR(10),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);

CREATE TABLE test_cases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    input VARCHAR(255) NOT NULL,
    expected_output VARCHAR(255) NOT NULL,
    exercise_id INT NOT NULL,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);

ALTER TABLE exercises ADD low_level BOOLEAN; 

-- adicionando casos de teste

INSERT INTO test_cases (exercise_id, input, expected_output) 
VALUES 

(1,'5\n1\n2\n8\n5\n11','NAO PRIMO\nPRIMO\nNAO PRIMO\nPRIMO\nPRIMO\n'),
(1, '3\n7\n10\n13', 'PRIMO\nNAO PRIMO\nPRIMO\n'), 
(1, '4\n4\n9\n17\n21', 'NAO PRIMO\nNAO PRIMO\nPRIMO\nNAO PRIMO\n'), 
(1, '6\n23\n29\n35\n37\n41\n49', 'PRIMO\nPRIMO\nNAO PRIMO\nPRIMO\nPRIMO\nNAO PRIMO\n'), 
(1, '2\n97\n100', 'PRIMO\nNAO PRIMO\n'), 
(1, '7\n89\n90\n91\n92\n93\n94\n95', 'PRIMO\nNAO PRIMO\nNAO PRIMO\nNAO PRIMO\nNAO PRIMO\nNAO PRIMO\nNAO PRIMO\n');

INSERT INTO test_cases (exercise_id, input, expected_output) VALUES
(2, '4\n)4x + 2(\n(7x + (2y - x))\n(11x + 3(\n(x + y - z - 20))', 'NAO\nSIM\nNAO\nNAO\n'),
(2, '3\n(x + y)\n((a + b) * c)\n(5 + 3) * (2 - 1)', 'SIM\nSIM\nSIM\n'),
(2, '2\n(2x + 3y - (4z))\n((a + b)', 'SIM\nNAO\n'),
(2, '5\n(x + (y * z))\n((a + b) + c)\n(())\n()\n(((x)))', 'SIM\nSIM\nSIM\nSIM\nSIM\n'),
(2, '3\n(x + y) * (z - 3\n(a + (b - c)\n(d + e) - (f + g))', 'NAO\nNAO\nNAO\n'),
(2, '4\n(()())\n()(()())\n((())\n(())())', 'SIM\nSIM\nNAO\nNAO\n');