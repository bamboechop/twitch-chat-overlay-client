# Twitch Chat Overlay Client for OBS

This repository contains the Twitch Chat Overlay Client for OBS which will be used by [bamboechop](https://github.com/bamboechop) on his Twitch livestreams.

* [Twitch Chat Overlay Client for OBS](#twitch-chat-overlay-client-for-obs)
  * [Why this project?](#why-this-project)
  * [How does this project work?](#how-does-this-project-work)
    * [Setting the defaults](#setting-the-defaults)
    * [Overriding defaults "at runtime"](#overriding-defaults-at-runtime)
    * [Configuring SSL for localhost](#configuring-ssl-for-localhost)

## Why this project?

I needed a small side project which I know I can complete within just a few days. There are a few bigger projects on my todo list, but I don't feel confident enough to start any of them at the moment.  
Also I kinda dislike using third party software to pep up my streams which made this the ideal evening side project.
Last but not least this also gave me a decent starter project to post about in the [WAC Discord](https://discord.com/invite/NCdAwHzMVn) devzember (devcember in English) channel.

This project utilizes Vite + Vue 3 + TypeScript + SCSS. For the Vue templates I use the `script setup` SFCs.

## How does this project work?

Since I'll be using this as an OBS browser source I wanted to be able to configure everything that needs to be configurable via the URL. For this the `Chat.vue` component contains the `URLSearchParams`. Should a value not be present in the URL I set defaults that make sense for me.

### Setting the defaults

To set the defaults please create a `.env` file in the root. Take a look at the `.env.example` file for a list of possible environment variables you can set and a short explanation of them.  
Everything you provide in your `.env` file will be used as defaults for various variables.

### Overriding defaults "at runtime"

To not always be forced to edit the `.env` file whenever you want to change something (e.g. the theme of the chat which is something that could be different for every scene you have in OBS) you can provide URL params.

* `debug` - can be set to `true` if you want to connect to an additional twitch channel chat. This can be useful when you want to test new themes and don't want to spam your main channel chat and instead use a second account channel chat or the chat of a random streamer that is currently online
* `theme` - can be set to any theme the overlay client supports. Useful when different scenes in OBS should show the chat in a different theme
  * Currently supported themes: `cities-skylines-ii`, `windows-95`

### Configuring SSL for localhost

To ensure that Twitch can correctly return information to our provided redirect URI it might be necessary to run HTTPS on localhost. You can use `mkcert` to generate self-signed certificates for localhost. To enable SSL for the development server, you can set the following environment variables.

* `ENABLE_HTTPS` - `<boolean>`
* `SSL_CERT_PATH` - path to the generated `cert.pem` file
* `SSL_KEY_PATH` - path to the generated `key.pem` file
