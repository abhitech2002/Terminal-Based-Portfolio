$(document).ready(function () {
  const themes = {
    light: {
      background: "#ffffff",
      color: "#000000",
      scrollbarColor: "#888",
    },
    dark: {
      background: "#000000",
      color: "#00ff00",
      scrollbarColor: "#00ff00",
    },
  };

  const directories = {
    education: [
      "<white>Education</white>",
      '* <a href="https://www.viva-technology.org/">VIVA Institute of Technology</a> <yellow>"Computer Science"</yellow> 2019-2023',
      '* <a href="https://en.wikipedia.org/wiki/Maharashtra_State_Board_of_Secondary_and_Higher_Secondary_Education">High Secondary</a> J.H.Poddar Junior College <yellow>"Computer Science"</yellow> 2017-2019',
      '* <a href="https://en.wikipedia.org/wiki/Maharashtra_State_Board_of_Secondary_and_Higher_Secondary_Education">Secondary School Certificate</a> Divine Hymn Hindi High School <yellow>"Hindi Medium"</yellow> 2017',
    ],
    projects: [
      "<white>Projects</white>",
      [
        "Notes App",
        "https://github.com/abhitech2002/notes-app",
        "A React and MySQL-based notes application",
        80,
      ],
      [
        "Crypto Website",
        "https://crypto-wallet-frontend-roan.vercel.app/",
        "A MERN stack-based cryptocurrency website..",
        90,
      ],
    ].map(([name, url, description = "", progress = 0]) => {
      return `* <a href="${url}">${name}</a> &mdash; <white>${description}</white> <green>[${progress}%]</green> ${renderProgressBar(
        progress
      )}`;
    }),
    skills: [
      "<white>Languages</white>",
      ["JavaScript", "TypeScript", "Python", "SQL", "C", "C++"].map(
        (lang) => `* <yellow>${lang}</yellow>`
      ),
      "<white>Libraries</white>",
      ["React.js", "Redux","Next JS", "Jest"].map((lib) => `* <green>${lib}</green>`),
      "<white>Tools</white>",
      ["Docker", "git","Bit Bucket", "GNU/Linux"].map((tool) => `* <blue>${tool}</blue>`),
    ].flat(),
  };

  let currentDir = "home";

  let feedback = [];

  let currentTheme = "dark";

  const commands = {
    help() {
      const helpText = `
            Available commands:
            - help: Show this help message
            - echo <text>: Echo back the provided text
            - dark_mode_toggle: Toggle between dark and light mode
            - about: Show information about the developer
            - projects: List available projects
            - contact: Display contact information
            - joke: Fetch and display a programming joke
            - credits: Show the JavaScript libraries used
            - social: List social media profiles
            - download_resume: Download the developer's resume as a PDF
            - rate project rating: Rate a project out of 5 (e.g., 'rate "Notes App" 4')
            - show_feedback: Show the feedback received for projects
            - cd directory: Change the current directory
            - ls: List available directories
            `;
      term.echo(helpText.trim());
    },
    echo(...args) {
      term.echo(args.join(" "));
    },
    dark_mode_toggle() {
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(newTheme);
      term.echo(`Switched to ${newTheme} mode.`);
    },
    about() {
      term.echo(
        "Hi! I'm Abhishek, a full-stack developer specializing in MERN/MEAN stack. Type 'projects' to see my work."
      );
    },
    projects() {
      term.echo(directories.projects.join("\n"));
    },
    contact() {
      term.echo(
        "Email: abhishek@example.com | LinkedIn: [[b;cyan;]https://linkedin.com/in/abhishek]"
      );
    },
    joke() {
      fetchJoke()
        .then((joke) => {
          typeAnimation(term, joke);
        })
        .catch(() => {
          term.echo("Oops! Couldn't fetch a joke at this time.");
        });
    },
    credits() {
      term.echo(
        "JavaScript Libraries Used:\n1. jQuery Terminal - [[b;cyan;]https://github.com/jcubic/jquery.terminal]\n2. Figlet.js - [[b;cyan;]https://github.com/patorjk/figlet.js]\n3. lolcat.js - [[b;cyan;]https://github.com/brianloveswords/lolcatjs]\n"
      );
    },
    social() {
      term.echo(
        "Social Media Profiles:\n" +
          "* LinkedIn: [[b;cyan;]https://linkedin.com/in/abhishek]\n" +
          "* GitHub: [[b;cyan;]https://github.com/abhitech2002]\n" 
        );
    },
    download_resume() {
      const resumeLink =
        "https://drive.google.com/uc?export=download&id=1QmQWukV9njH-bRRQqOazg0Twd1pqgVjm";

      const link = document.createElement("a");
      link.href = resumeLink;
      link.download = "Abhishek_Resume.pdf"; 
      document.body.appendChild(link);
      link.click(); 
      document.body.removeChild(link); 
      term.echo(`Resume Link: <a href="${resumeLink}" target="_blank">${resumeLink}</a>`);
    },
    rate(project, rating) {
      if (directories.projects.some((p) => p.includes(project))) {
        feedback.push({ project, rating });
        term.echo(
          `Thank you! Your rating of ${rating} for ${project} has been recorded.`
        );
      } else {
        term.echo(`Project '${project}' not found.`);
      }
    },
    show_feedback() {
      if (feedback.length === 0) {
        term.echo("No feedback available yet.");
      } else {
        feedback.forEach(({ project, rating }) => {
          term.echo(`Project: ${project} | Rating: ${rating}/5`);
        });
      }
    },
    cd(directory) {
      if (directories[directory]) {
        currentDir = directory;
        term.echo(`You are now in the ${directory} directory.`);
        term.echo(directories[directory].join("\n"));
      } else if (directory === ".." || directory === "home") {
        currentDir = "home";
        term.echo("You are now in the home directory.");
      } else {
        term.echo(`Directory '${directory}' not found.`);
      }
    },
    ls() {
      term.echo(Object.keys(directories).join("\n"));
    },
  };

  const formatter = new Intl.ListFormat("en", {
    style: "long",
    type: "conjunction",
  });

  const command_list = ["clear", "cd", "ls"].concat(Object.keys(commands));
  const help = formatter.format(command_list);

  const term = $("#terminal").terminal(commands, {
    greetings: false,
    checkArity: false,
    exit: false,
  });

  term.pause();

  function render(text) {
    const cols = term.cols();
    return trim(
      figlet.textSync(text, {
        font: "Slant",
        width: cols,
        whitespaceBreak: true,
      })
    );
  }

  function trim(str) {
    return str.replace(/[\n\s]+$/, "");
  }

  function ready() {
    term
      .echo(() => {
        const ascii = rainbow(render("Terminal Portfolio"));
        return `${ascii}\n[[;white;]Welcome to my Terminal Portfolio! Type "help" to see available commands.]\n`;
      })
      .resume();
  }

  function rainbow(string) {
    return lolcat
      .rainbow(function (char, color) {
        char = $.terminal.escape_brackets(char);
        return `[[;${hex(color)};]${char}]`;
      }, string)
      .join("\n");
  }

  function hex(color) {
    return (
      "#" +
      [color.red, color.green, color.blue]
        .map((n) => {
          return n.toString(16).padStart(2, "0");
        })
        .join("")
    );
  }

  async function fetchJoke() {
    const response = await fetch(
      "https://official-joke-api.appspot.com/jokes/programming/random"
    );
    const jokeData = await response.json();
    const joke = jokeData[0];
    return `${joke.setup}\n${joke.punchline}`;
  }

  function typeAnimation(terminal, text, delay = 50) {
    let i = 0;
    const interval = setInterval(() => {
      terminal.echo(text.charAt(i), { newline: false });
      i++;
      if (i === text.length) {
        clearInterval(interval);
        terminal.echo("");
      }
    }, delay);
  }

  function renderProgressBar(progress) {
    const totalBars = 20;
    const filledBars = Math.round((progress / 100) * totalBars);
    return (
      "[" + "=".repeat(filledBars) + " ".repeat(totalBars - filledBars) + "]"
    );
  }

  function applyTheme(themeName) {
    const theme = themes[themeName];
    $("#terminal").css({
      backgroundColor: theme.background,
      color: theme.color,
    });
    $("#terminal::-webkit-scrollbar-thumb").css(
      "background",
      theme.scrollbarColor
    );
    currentTheme = themeName;
    localStorage.setItem("theme", themeName);
  }

  figlet.defaults({ fontPath: "https://unpkg.com/figlet/fonts/" });
  figlet.preloadFonts(["Slant"], ready);
});
