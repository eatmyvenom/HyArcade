## How roles are updated
1) Every time the database updates its data it sets a flag in the shared runtime file. 
2) Every 10 seconds the process handling the bot checks this file for that flag. 
3) If the flag is detected then it goes through every discord with a role handler and grabs all the members. 
    - For every member if their discord ID matches an account in the bots database (basically if they are linked) it checks that role handlers specific stat against the role of the account. 
      - It iterates the roles top down, if the account doesn't have above a specific win count it moves on to the next win count. 
      - When it finds the win count role appropriate for the user it checks if they have the role already, if so then it moves on the next person. 
      - If the correct role is not assigned then it assigns it. 
      - It then goes through the rest of the win count roles and makes sure they are not set. 
      - If there is another win count role set then it removes it from the user and then moves on to the next person.
