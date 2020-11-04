---
title: How I setup a new development environment
description: It takes time to setup a new development environment. Thank God developers are so lazy.
date: 2020-05-19
tags: [Development]
---

One of the things that happen when you join a new company or you get a new computer, is that you need to start fresh and start installing all the necessary applications in your brand new work station.
I've been in that situation more than one time and is very tedious. For that reason, I started to look into creating a **bash shell** that could deal with all my problems so I could grab a cup of tea and
read some manga while I was waiting for all the software and utilities to be ready. A friend also pointed to me that using the package manager [Homebrew](https://brew.sh/) for this task would be a no brainer
if my target was a Mac computer. So, let's start by explaining a bash script that does what I need.

The first thing to do is to create our **install.sh** and ask for **sudo** powers.

```sh
#!/usr/bin/env bash

sudo -v
```

After that, we will create a custom **keep-alive** command that will be running in the background. With this little trick, we aren't going to ask for a password in the entire execution of our script.

```sh
while true; do sudo -n true; sleep 60; kill -0 "$$" || exit; done 2>/dev/null &
```

The next thing is that we are going to check if we have [Homebrew](https://brew.sh/) installed. If not, then we are going to prompt a message that we are going to do it at that moment thanks to their
`curl` installation.

```sh
if [ ! $(which brew) ]; then
  echo "Installing homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
fi
```

The fun part begins now. We are going to use the power of **Homebrew** to install our command-line software and the help of **Cask** to install our graphical applications.

```sh
echo "Updating Brew"
brew update
brew upgrade

echo "Installing software"
brew install git \
             node

brew cask install google-chrome \
                  visual-studio-code

echo "cleaning up homebrew"
brew cleanup
```

Since we are lazy developers, let's go further and create an interactive configuration for git while creating the necessary keys for later usage in [Github](https://github.com/).

```sh
if ! [[ $(git config --global user.name) ]] || ! [[ $(git config --global user.email) ]]; then
    echo "Configuration for git"
fi

if ! [[ $(git config --global user.name) ]]; then
    read -rp 'Name: ' name
    git config --global user.name "$name"
fi

if ! [[ $(git config --global user.email) ]]; then
    read -rp 'Email: ' email
    git config --global user.email "$email"
fi

# Check if we have keys already
if [ ! -f ~/.ssh/id_rsa.pub ]; then
  if  [ -z "$email" ];then
    read -rp 'Email: ' email
    git config --global user.email "$email"
  fi

  ssh-keygen -t rsa -b 4096 -C "$email"
  eval "$(ssh-agent -s)"
  ssh-add -K ~/.ssh/id_rsa
fi

pbcopy < ~/.ssh/id_rsa.pub

echo "Your SSH key has been copied to your clipboard. Go to https://github.com/settings/keys and setup your new key"
```

And that's it. Now you can go directly to Github settings and paste your keys and start developing. If you're interested in some software that I use, you can find my shell script as a
[Github gist](https://gist.github.com/AlgusDark/33e8f6504c9bbecc9aad642fcfc1f6ec). Play with it and add some nice prompts.

I added a nice Hatsune Miku to know that my script is finished.

![Hatsune Miku draw in ASCII](./install-shell.png)
