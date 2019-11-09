# (see https://nixos.org/nix/)

with import <nixpkgs> {};

stdenv.mkDerivation rec {
    name = "cortex";
    buildInputs = [
        python3 python3Packages.pip python3Packages.setuptools libffi openssl
    ];

    shellHook = ''
        export SOURCE_DATE_EPOCH=315532800
    '';
}
