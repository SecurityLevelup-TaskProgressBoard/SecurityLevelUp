# Security Levelup: Taskify

## Features:

- **Task Tracking**: Monitor the progress of taskse.
- **Accessibility**: Access the application from any device with internet connectivity.

## Hosted Frontend:

The hosted frontend version of Taskify is available at [taskify.phipson.co.za](https://taskify.phipson.co.za/login.html).

## Local testing:

- You need a linux environment like WSL with docker installed.

### Steps:

1. Clone the repo and go to the project.

   ```bash
   $ git clone https://github.com/SecurityLevelup-TaskProgressBoard/SecurityLevelUp.git
   $ cd SecurityLevelUp
   ```

2. Run this command in `WSL`

   ```bash
   $ sudo ./run_digidy.sh
   ```

3. This will deploy the stack locally, and launch the webpage when done.

**NOTE**: if you get a syntax error when running the script - open the script in VSCode and change the line ending to LF instead of CRLF, then it should run fine.

If you get an error for the back end failing to build, ensure your dotnet version is up to date and run again.

4. To mainually access the website when it is up, go to [http://localhost:5500](http://localhost:5500)

5. To tear down the container and the associated volumes run:

   ```bash
   $ sudo docker compose down --volumes
   ```

   This will remove the persistent storage, if you want to run it again clean.

   Contact us if you have an issue.
