Task A - Mystic Waves
How to Run
Requirements
Python 3.8 or higher
Run the program
bash
python A.py
Example Input
text
4
1 4
2 5
3 6
4 7
Example Output
text
0
2
0
4
Assumptions Made
The input format follows the problem statement exactly.
`1 ≤ t ≤ 100`
`1 ≤ x ≤ 10`
`1 ≤ n ≤ 10`
Each test case contains two valid integers `x` and `n`.
The program reads input from standard input and writes results to standard output.
Complexity Analysis
Time Complexity: O(1) per test case
Space Complexity: O(1)

B. CargoCraft Fleet
How to Run
python B.py
Example input:
4
4
7
24
998244353998244352
Example output:
1 1
-1
4 6
166374058999707392 249561088499561088
Assumptions
Input follows the format specified in the problem statement.
Only 4-unit and 6-unit crafts are available.

Python 3 is installed.
Complexity
Time: O(1) per test case
Space: O(1)


D E-commerce Product Detail Page

A fully functional e-commerce product detail page built with plain HTML, CSS, and JavaScript. This project demonstrates frontend engineering skills including API integration, state management, error handling, and user experience design.

Features

Product Display
Product Image- High-quality product imagery
Product Name- Clear product identification
Product Price- Dynamic pricing based on selected variant
Stock Status- Real-time stock availability display
Product Description - Detailed product information


🎯 Technical Implementation

 Mock API
The project includes a complete mock API implementation:

getProductDetail(productId) - Returns product data with variants
addToCart({productId, skuId, quantity})- Handles add-to-cart requests
removeFromCart({skuId, quantity}) - Handles item removal from cart


Technologies Used

HTML5- Semantic markup
CSS3 - Modern styling with gradients, animations, and responsive design
JavaScript (ES6+) - Vanilla JavaScript with async/await
No Frameworks- Pure frontend implementation

![image alt](https://github.com/shakil262/my-all-project-/blob/ae09f584efcbbfb426dbaf52633a4fb708367cc1/all%20img.png)
 How to Run
 Option 1: Python HTTP Server
bash
python -m http.server 8000
 Open http://localhost:8000/

Option 2: Node.js HTTP Server
bash
npx http-server -p 8000
Open http://localhost:8000/

Option 3: Direct File Open
Simply double-click `index.html` to open it in your browser.

 Requirements Met
This project implements all requirements from the frontend coding test:
1.UI Display- Product image, name, price, stock, description, and 2 variant dimensions
2.Interaction Logic- Variant selection, quantity control, add-to-cart with all constraints
3.Mock API- Complete mock API with proper response formats
4.Required States- Loading, API error, out of stock, success, and failure states

 Design Features
Modern UI- Gradient backgrounds, rounded corners, smooth animations
Responsive Design - Mobile-friendly layout
Visual Feedback- Hover effects, active states, loading spinners
Accessibility - Clear labels, proper contrast, keyboard navigation
Professional Look - Feature cards for shipping, warranty, returns, support

Product Information

Product:HP Pavilion 15 Laptop
Description:The HP Pavilion 15 features the latest Intel® Core™ i5 14th Generation processor, delivering fast and reliable performance for work, study, programming, and entertainment. With a vibrant 15.6-inch Full HD display, high-speed SSD storage, and long-lasting battery life, it ensures a smooth and responsive user experience. Its sleek, lightweight design makes it the perfect laptop for professionals, students, and everyday productivity.





