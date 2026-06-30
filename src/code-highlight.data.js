export const CODE_HIGHLIGHT_PATTERNS = {
  javascript: [
    { name: 'comment', regex: /\/\/[^\n]*|\/\*[\s\S]*?\*\// },
    { name: 'string', regex: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/ },
    { name: 'number', regex: /\b\d+(?:\.\d+)?\b/ },
    { name: 'keyword', regex: /\b(?:const|let|var|function|return|class|import|export|from|if|else|for|while|do|switch|case|break|continue|default|try|catch|finally|throw|new|this|typeof|instanceof|yield|await|async|debugger|arguments|true|false|null|undefined)\b/ },
    { name: 'builtin', regex: /\b(?:console|log|window|document|process|global|require|module|exports|Math|Object|Array|String|Number|Boolean|Date|RegExp|Error|Promise|Map|Set|JSON)\b/ },
    { name: 'function', regex: /[a-zA-Z_]\w*(?=\s*\()/ },
    { name: 'operator', regex: /=>|={1,3}|!={1,2}|&lt;={1,2}|&gt;={1,2}|[+\-*\/%&|^~<>!?:;.,[\]{}()]/ }
  ],
  python: [
    { name: 'comment', regex: /#[^\n]*/ },
    { name: 'string', regex: /"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/ },
    { name: 'number', regex: /\b\d+(?:\.\d+)?\b/ },
    { name: 'keyword', regex: /\b(?:def|class|return|if|elif|else|for|while|try|except|finally|import|from|as|global|nonlocal|lambda|pass|break|continue|in|is|and|or|not|with|yield|assert|del|raise|True|False|None)\b/ },
    { name: 'builtin', regex: /\b(?:print|len|range|str|int|float|list|dict|set|tuple|open|max|min|sum|abs|type|id|map|filter|zip|enumerate)\b/ },
    { name: 'function', regex: /[a-zA-Z_]\w*(?=\s*\()/ },
    { name: 'operator', regex: /[+\-*\/%&|^~=<>!?:;.,[\]{}()]/ }
  ],
  html: [
    { name: 'comment', regex: /&lt;!--[\s\S]*?--&gt;/ },
    { name: 'keyword', regex: /&lt;\/?[a-zA-Z0-9:\-]+|&gt;/ },
    { name: 'string', regex: /"[^"]*"|'[^']*'/ },
    { name: 'builtin', regex: /\b[a-zA-Z0-9\-]+(?=\s*=)/ },
    { name: 'operator', regex: /=/ }
  ],
  css: [
    { name: 'comment', regex: /\/\*[\s\S]*?\*\// },
    { name: 'keyword', regex: /@\w+|!important/ },
    { name: 'builtin', regex: /\b[a-zA-Z\-]+(?=\s*:)/ },
    { name: 'string', regex: /url\([^)]+\)|"[^"]*"|'[^']*'/ },
    { name: 'number', regex: /\b\d+(?:px|em|rem|%|vh|vw|ms|s|deg)?\b/ },
    { name: 'function', regex: /[a-zA-Z_]\w*(?=\s*\()/ },
    { name: 'operator', regex: /[{}:;,]/ }
  ],
  rust: [
    { name: 'comment', regex: /\/\/[^\n]*|\/\*[\s\S]*?\*\// },
    { name: 'string', regex: /r?"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])'/ },
    { name: 'number', regex: /\b\d+(?:\.\d+)?(?:u8|u16|u32|u64|u128|i8|i16|i32|i64|i128|f32|f64|usize|isize)?\b/ },
    { name: 'keyword', regex: /\b(?:fn|let|mut|pub|use|mod|struct|enum|impl|trait|for|while|loop|if|else|match|return|break|continue|as|ref|self|Self|const|static|unsafe|where|type|dyn|async|await|move|true|false)\b/ },
    { name: 'builtin', regex: /\b(?:println|print|format|panic|vec|Result|Option|Some|None|Ok|Err|Box|Rc|Arc|String|str|bool|char|u8|u16|u32|u64|u128|i8|i16|i32|i64|i128|f32|f64|usize|isize)\b/ },
    { name: 'function', regex: /[a-zA-Z_]\w*(?=\s*\()/ },
    { name: 'operator', regex: /[-+*\/%&|^=<>!?:;.,[\]{}()]/ }
  ],
  cpp: [
    { name: 'comment', regex: /\/\/[^\n]*|\/\*[\s\S]*?\*\// },
    { name: 'string', regex: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/ },
    { name: 'number', regex: /\b\d+(?:\.\d+)?\b/ },
    { name: 'keyword', regex: /\b(?:int|double|float|char|void|bool|class|struct|public|private|protected|virtual|override|return|if|else|for|while|do|switch|case|break|continue|default|try|catch|throw|new|delete|namespace|using|std|cout|cin|endl|include|define|ifdef|ifndef|endif|true|false|nullptr)\b/ },
    { name: 'function', regex: /[a-zA-Z_]\w*(?=\s*\()/ },
    { name: 'operator', regex: /[+\-*\/%&|^~=<>!?:;.,[\]{}()]/ }
  ],
  java: [
    { name: 'comment', regex: /\/\/[^\n]*|\/\*[\s\S]*?\*\// },
    { name: 'string', regex: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/ },
    { name: 'number', regex: /\b\d+(?:\.\d+)?\b/ },
    { name: 'keyword', regex: /\b(?:public|private|protected|class|interface|extends|implements|static|final|void|int|double|float|char|boolean|return|if|else|for|while|do|switch|case|break|continue|default|try|catch|finally|throw|throws|new|this|super|package|import|null|true|false)\b/ },
    { name: 'function', regex: /[a-zA-Z_]\w*(?=\s*\()/ },
    { name: 'operator', regex: /[+\-*\/%&|^~=<>!?:;.,[\]{}()]/ }
  ],
  sql: [
    { name: 'comment', regex: /\-\-[^\n]*|\/\*[\s\S]*?\*\// },
    { name: 'string', regex: /'(?:''|[^'])*'/ },
    { name: 'number', regex: /\b\d+(?:\.\d+)?\b/ },
    { name: 'keyword', regex: /\b(?:select|from|where|insert|into|values|update|set|delete|create|table|drop|alter|add|column|join|left|right|inner|outer|on|group|by|order|having|limit|offset|and|or|not|in|exists|like|is|null|as|union|all|primary|key|foreign|index|unique|default|check)\b/ },
    { name: 'operator', regex: /[+\-*\/%=<>!?:;.,()]/ }
  ],
  json: [
    { name: 'string', regex: /"(?:\\.|[^"\\])*"/ },
    { name: 'number', regex: /\b-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/ },
    { name: 'keyword', regex: /\b(?:true|false|null)\b/ },
    { name: 'operator', regex: /[{}[\]:,]/ }
  ]
};

export const CODE_SNIPPET_DEFAULTS = {
  javascript: `// Quick Sort Algorithm
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];
  
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  
  return [...quickSort(left), pivot, ...quickSort(right)];
}

const numbers = [8, 3, 5, 1, 4, 2];
console.log("Sorted:", quickSort(numbers));`,

  python: `# Fibonacci Sequence Generator
def fibonacci(n: int) -> list[int]:
    if n <= 0:
        return []
    elif n == 1:
        return [0]
        
    sequence = [0, 1]
    while len(sequence) < n:
        next_val = sequence[-1] + sequence[-2]
        sequence.append(next_val)
    return sequence

# Print first 10 numbers
print("Fibonacci:", fibonacci(10))`,

  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ZeroG Toolbox</title>
  <style>
    body {
      background: #09090b;
      color: #f4f4f5;
      font-family: sans-serif;
    }
  </style>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>In-browser, secure utilities.</p>
</body>
</html>`,

  css: `/* Glassmorphism Card Style */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-4px);
  border-color: rgba(99, 102, 241, 0.4);
}`,

  rust: `// Standard Rust Struct and Implementation
#[derive(Debug)]
struct Player {
    name: String,
    score: u32,
    active: bool,
}

impl Player {
    fn new(name: &str) -> Self {
        Player {
            name: name.to_string(),
            score: 0,
            active: true,
        }
    }

    fn increment_score(&mut self, points: u32) {
        self.score += points;
    }
}`,

  cpp: `#include <iostream>
#include <vector>

// C++ Vector Summation
int sumElements(const std::vector<int>& vec) {
    int total = 0;
    for (int num : vec) {
        total += num;
    }
    return total;
}

int main() {
    std::vector<int> data = {1, 2, 3, 4, 5};
    std::cout << "Sum: " << sumElements(data) << std::endl;
    return 0;
}`,

  java: `import java.util.List;

// Java Summation Example
public class Main {
    public static void main(String[] args) {
        List<Integer> list = List.of(1, 2, 3, 4, 5);
        int sum = list.stream().mapToInt(Integer::intValue).sum();
        System.out.println("Sum: " + sum);
    }
}`,

  sql: `-- Get top spending customers
SELECT 
    c.customer_id,
    c.first_name,
    c.last_name,
    SUM(o.total_amount) AS total_spent
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_date >= '2026-01-01'
GROUP BY c.customer_id, c.first_name, c.last_name
HAVING SUM(o.total_amount) > 1000
ORDER BY total_spent DESC
LIMIT 5;`,

  json: `{
  "appName": "ZeroG Toolbox",
  "version": "1.0.0",
  "features": {
    "clientSide": true,
    "webAssembly": true,
    "webGPU": true
  },
  "keywords": [
    "utility",
    "privacy",
    "developer"
  ]
}`
};
