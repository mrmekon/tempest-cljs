# tempest-cljs

[tempest-wiki]: <http://en.wikipedia.org/wiki/Tempest_(video_game)>

This is an experiment to learn ClojureScript.  It will (probably) never be completed, but will slowly head in the direction of becoming the [Tempest arcade game][tempest-wiki], until I move on to other things.

I do not know Clojure, nor ClojureScript, nor Javascript, so if you use this as a reference, be careful.

Additionally, I developed the Tempest logic without much forethought.  It just morphed its way up from drawing random lines.  That means you're looking at thousands of floating point operations per frame... probably not a web browser's strongest point.

Game logic is written in ClojureScript, backend is in Clojure with the Noir framework.

## Game Demo

[Demo levels](http://mrmekon.github.com/tempest-cljs/)

## Documentation

[Marginalia Annotated Source](http://mrmekon.github.com/tempest-cljs/doc.html)

## Screenshots

<img src="http://cloud.github.com/downloads/mrmekon/tempest-cljs/screenshot-stepped-v.png" />

<img src="http://cloud.github.com/downloads/mrmekon/tempest-cljs/screenshot-action.png" />

<img src="http://cloud.github.com/downloads/mrmekon/tempest-cljs/screenshot-round.png" />

<img src="http://cloud.github.com/downloads/mrmekon/tempest-cljs/screenshot-flat.png" />

<img src="http://cloud.github.com/downloads/mrmekon/tempest-cljs/screenshot-oblong.png" />

## Usage

### Compile ClojureScript

```bash
lein deps
lein cljsbuild once
```

### Run Jetty webserver hosting Noir app
```bash
lein run
```

Then navigate to http://localhost:8080/tempest/5.  Replace 5 with the level you want to play.

## License

Copyright (c) 2012, Trevor Bentley
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the <organization> nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
