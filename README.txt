CSE410 Blockchain Project Part 1 README File

Junjie Chen & Yinghui Zou

First, in the index.js file, you need change two things before start testing it. You need change MySQL connection to yours from line 24 to 30, you will most likely only need to change user and host. The other thing you need to change is the directory of sendFile on line 41, where you have to change from my directory pathway to your directory pathway of index.html

Once you have these two things done, you may run the backend by typing node index.js in the command and then open localhost by typing http://localhost:1337/ onto the website. 

We have the following dependencies in our code:
"alert-node": "^1.2.3",
"body-parser": "^1.18.3",
"express": "^4.16.4",
"mysql": "^2.16.0",
"nodemon": "^1.18.10",
"pug": "^2.0.3",
"web3": "github:ethereum/web3.js"

Our first function is Register an Account. You have two dropdowns which left one is register from and the right one is register to. Register from is the person who is going to register the account, and the person must be chairperson which is the first option on the dropdown, the chairperson address is “0xca35b7d915458ef540ade6068dfe2f44e8fa733c”. If the person who is not chairperson, then you will unable to register an account, you will see a pop-up window saying something like “unable to register”. If you use the chairperson for Register from, then you will see a pop-up window saying “you have registered an account” The chairperson is registered initially so you don’t need to register itself again.

Our second function is Unregister function. This allow you to unregister an account by picking the one on the dropdown. Once you click submit, the account you selected will be removed from the database, and you will see a pop-up window.

Our third function is Deposit. Where you can add money to an account by entering a number and selecting an account from the dropdown. Once you click submit, our database will update the new account balance to the account you selected from the dropdown, and you will see how much you deposit to the account you selected.

Our fourth function is Get Account Balance. Where you can select an account from the dropdown, once you click submit button, you can see the current account balance from a pop-up window.

Our fifth function is Sell an Item. Where you can sell an item on the market. First of all, you have to enter the Item title, Item price, Item owner from the dropdown selection, and the image URL to display the item. The image URL must be a valid link, otherwise it will not able to display on the market table. Once you have everything input, then click submit, all the information you input will be stored in our database, item status will be available initially. Once a book is added to our database, you will see a pop-up window saying “you have added an item”. Once you added a book, you have to refresh the page in order to see the updated table.

Our sixth function is Buy an Item. Where you can purchase an item, and the item you chose will be in pending status just like the credit card you have to wait for settle payment in order to be charged. You have to enter the correct Item ID as well as the Seller ID which is the account owner address on item you selected in the table, then the buyer ID would be the person who wants to buy the item. Once you click submit button, the item status will be in pending but no transaction is made yet. You will see a pop-up window saying “pending”.

Our last function is Settle Payment. Which is the confirmation of the transaction for the pending item. You have to enter the exactly same thing from buy an item function, where you have to input Item ID, Buyer ID, and Seller ID. Once you click submit button, if all the information enters match to our database, then our code will check if the buyer has enough money for the item. If so, then the transaction will be made, and the item owner will be updated in the table from seller to the item buyer, both buyer and seller’ accounts wallet will be updated as well. If the transaction is made, you will see a pop-up window saying “settle payment passes”.
