# -*- mode: ruby -*-
# vi: set ft=ruby :

ENV["LC_ALL"] = "en_US.UTF-8"

Vagrant.require_version ">= 1.8.1"

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/wily32"
  config.vm.network "forwarded_port", guest: 8090, host: 8090, auto_correct: true

  config.vm.provision "shell", privileged: false, inline: <<-SHELL
    #!/bin/bash
    #Aseguramos que este todo updateado
    sudo apt-get clean
    sudo apt-get update

    #Herramientas de buildeo
    sudo apt-get install -y build-essential libssl-dev curl
    sudo apt-get install -y git

    #Instalar NVM
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
    source "/home/vagrant/.bashrc"
    source "/home/vagrant/.nvm/nvm.sh"
    nvm install 0.12.7

  SHELL
end
