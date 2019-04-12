// Modular Reveal Pattern
		// used to keep private variables hidden from global scope and give access to public variables
// Abstract Singleton Design Pattern
		// used to assemble a group of functions that are related to one system feature into one variable that can have delayed instantiation but need to be instantiated only once
// Abstract Factory Design Pattern
		// used to validate object templates that should be duplicated (by checking the properties of the object) and to produce instances of those validatd templates
// Builder Design Pattern
		// used to build an item by assembling individual components and combining them together
// Prototype Design Pattern
		// used to clone one prototype properties into another prototype
// Adapter Design Pattern
		// used to replace a simple element with a specialized object
// Composite Design Pattern
		// used to invoke only one function on multiple objects concurrently
// Decorator Design Pattern
		// used to assign event handlers to a group of shapes
// Fly Weight Design Pattern
		// used to assign event handlers to individual shapes
// Facade Design Pattern
		// used to control which api's of the object is available for public use 
		// for the Canvas object: 'move', 'colorAll', and 'getID' functions were made public and 'add', 'setID', 'get' functions were blocked
		// the functions that were made public can be accessed from $(win.document).ready(function()) scope
// Proxy Design Pattern
		// used to assign properties from Convas to Convas Facade with 'binder' function
// Chain Responsibility Pattern
		// use a chain logic for one connected object to run the same function in another after it has run the same function in itself
// Observer Design Pattern
		// use an event dispatch decorateor to create an object that will store a list of functions and runs it when a certain 'type' associated with the list is inputted
// State Design Pattern
		// use states that are external from the objects to control the properties of the object depending on its state

		(function(win, $){
			function clone(src, out) {
				for(var attr in src.prototype) {
					out.prototype[attr] = src.prototype[attr];
				}
			}
		
			function Canvas() {
				this.item = $('<div class="canvas"></div>');
				this._collection = [];
				this.controller = new CompositeController(this._collection);
				this.colorAll = function(color) {
					this.controller.action('color', color);
				}
				this.add = function(shape, color, left, top) {
					var newShape;
					if(shape === 'circle') {
						newShape = new Circle();
					} else if (shape === 'square') {
						newShape = new Square();
					}
					newShape.color(color);
					newShape.move(left, top);
					this._collection.push(newShape);
					this.item.append(newShape.get());
				}
				this.getID = function() {
					return this.id;
				}
				this.setID = function(id) {
					this.id = id
				},
				this.next = function(canvas) {
					if(canvas) {
						this.nextCanvas = canvas;
					}
					return this.nextCanvas;
				},
				this.chainDo = function(action, args, count) {
					this[action].apply(this, args);
					if(count && this.nextCanvas) {
						this.nextCanvas.chainDo(action, args, --count)
					}
				},
				this.fade = function(opacity){
					this.item.css('opacity', opacity)
				}
			}
		
			Canvas.prototype.move = function(left, top) {
				this.item.css('left', left);
				this.item.css('top', top);
			}
		
			Canvas.prototype.get = function() {
				return this.item;
			}
		
			function binder(scope, copyFunction) {
				return function() {
					return copyFunction.apply(scope, arguments);
				};
			}
		
			function canvasFacade(canvas) {
				return {
					colorAll: binder(canvas, canvas.colorAll),
					move: binder(canvas, canvas.move),
					getID: binder(canvas, canvas.getID)
				};
			}
		
			function Circle() {
				this.item = $('<div class="circle"></div>');
			}
		
			clone(Canvas, Circle);
		
			Circle.prototype.color = function(clr){
				this.item.css('background', clr);
			}
		
			function Square() {
				this.item = $('<div class="square"></div>');
			}
		
			clone(Circle, Square);
		
			function selfDestructDecorator(obj) {
				obj.kill = function() {
					obj.item.remove();
				}
				obj.item.hover(function() {
					obj.kill();
				})
			}
		
			function BubbleBuilder() {
				this.item = new Canvas();
				this.init();
			}
		
			BubbleBuilder.prototype.init = function() {
				this.item.add('circle', 'pink', 40, 40);
				this.item.add('circle', 'orange', -60, 50);
				this.item.add('circle', 'yellow', -40, -70);
				this.item.add('circle', 'salmon', 50, -40);
			}
		
			BubbleBuilder.prototype.get = function() {
				return this.item;
			};
		
			function BlockBuilder() {
				this.item = new Canvas();
				selfDestructDecorator(this.item);
				this.init();
			}
		
			BlockBuilder.prototype.init = function() {
				this.item.add('square', 'pink', 40, 40);
				this.item.add('square', 'orange', -50, 60);
				this.item.add('square', 'yellow', -70, -40);
				this.item.add('square', 'salmon', 40, -50);
			}
		
			BlockBuilder.prototype.get = function() {
				return this.item;
			}
		
			ShapeFactory = function() {
				this.types = {};
				this.register = function(type, cls) {
					if(cls.prototype.init && cls.prototype.get){
						//the line here checks the prototypes methods of the object to check if it passes validation
						this.types[type] = cls;
					}		
				this.create = function(type) {
					//onlyobjets that have passed validation and registered can be created
					return new this.types[type]().get();
					}}
			};
		
			function StageAdapter(id) {
				this.item = $('body');
				this.index = 0;
				this.context = $(id);
				this.SIG = 'stageItem_';
			}
		
			StageAdapter.prototype.add = function(item){
				++this.index;
				item.addClass(this.SIG + this.index);
				this.context.append(item);
			}
		
			StageAdapter.prototype.remove = function(index) {
				this.context.remove('.' + this.SIG + index);
			}
		
			function CompositeController(collectionArray) {
				this.collection = collectionArray;
			}
		
			CompositeController.prototype.action = function(act) {
				var args = [...arguments];
				args.shift();
				for(var item in this.collection) {
					this.collection[item][act].apply(this.collection[item], args);
				}
			}
		
			function flyWeightFader(item) {
				if(item.hasClass('circle')){
					// item.fadeTo(.5, item.css('opacity')*.5);
					item.remove();
				}
			}
		
			
			function eventDispatcherDecorator(controller) {
				var list = {};
				controller.addEvent = function(type, listener) {
					if(!list[type]){
						list[type] = [];
					}
					if(list[type].indexOf(listener) === -1){
						list[type].push(listener);
					}
				};
				controller.dispatchEvent = function(e) {
					var aList = list[e.type];
					if(aList) {
						if(!e.target){
							e.target = this;
						}
						for(var index in aList) {
							aList[index](e);
						}
					}
				}
				controller.removeEvent = function(type, listener) {
					var a = list[type];
					if(a){
						var index = a.indexOf(listener);
						if(index>-1){
							a.splice(index,1);
						}
					}
				};
			}
		
			var cow1 = function(){console.log('this is cow 1')};
			var cow2 = function(){console.log('this is cow 2')};
			var pig1 = function(){console.log('this is pig 1')};
			var pig2 = function(){console.log('this is pig 2')};
		
			function Observer () {
				eventDispatcherDecorator(this);
				this.addEvent('cow command', cow1);
				this.addEvent('cow command', cow2);
				this.addEvent('cow command', cow2);
				this.addEvent('cow command', function(){console.log('this is same cow 3')});
				this.addEvent('cow command', function(){console.log('this is same cow 3')});
				this.addEvent('pig command', pig1);
				this.addEvent('pig command', pig2);
				this.addEvent('pig command', pig2);
				this.addEvent('pig command', function(){console.log('this is same pig 3')});
				this.addEvent('pig command', function(){console.log('this is same pig 3')});
				this.removeEvent('pig command', pig2);
			}
		
			var ClickShapeGeneratorSingleton = (function() {
				var instance;
				function init() {
					var _collection = [],
					_factory = new ShapeFactory();
					_controller = new CompositeController(_collection);
					_observer = new Observer();
		
					function registerShape(name, cls) {
						_factory.register(name, cls);
					}
		
					function setStage(stg = $('body')){
						_stage = new StageAdapter(stg);
					}
		
					setStage();
		
					function create(left, top, type) {
						var canvas = _factory.create(type);
						var index = _collection.length-1;
						canvas.setID(_collection.length);
						canvas.move(left, top);
						_collection.push(canvas);
		
						if(index!=-1) {
							_collection[index].next(canvas);
						}
		
						return canvasFacade(canvas)
					}
		
					function chainFade(count) {
						//do not run the fade in the newly created object
						var index = Math.max(0, _collection.length - count);
						_collection[index].chainDo('fade', ['-=0.2'], count);
					}
		
					function colorAll(color) {
						_controller.action('colorAll', color);
					}
		
					function move(left, top) {
						_controller.action('move', left, top);
					}
		
					function add(canvasFacade) {
						_stage.add(_collection[canvasFacade.getID()].get());
					}
		
					function index() {
						return _collection.length
					}
		
					function command(type) {
						_observer.dispatchEvent({type});
					}
		
					return {
						index,
						create,
						add,
						register: registerShape,
						setStage,
						move,
						colorAll,
						chainFade,
						command
					};
				}
				return {
					getInstance: function() {
						if(!instance){
							instance = init();
						}
						return instance;
					}
				}
			})();
		
			function RedState(obj) {
				var on = 'red',
				off = 'rgba(255,0,0,.25)',
				_nextState;
		
				this.nextState = function(ns) {
					_nextState = ns;
				};
		
				this.start = function() {
					obj.colorAll(on);
					setTimeout(binder(_nextState,_nextState.start), 1000);
					setTimeout(function() {
						obj.colorAll(off);
					}, 1000);
				}
			}
		
			function YellowState(obj) {
				var on = 'yellow',
				off = 'rgba(255,255,0,.25)',
				_nextState;
		
				this.nextState = function(ns){
					_nextState = ns;
				};
		
				this.start = function() {
					obj.colorAll(on);
					setTimeout(function() {
						obj.colorAll(off);
						_nextState.start();
					}, 1000);
				}
			}
		
			function GreenState(obj) {
				var on = 'green',
				off = 'rgba(0,255,0,.25)',
				_nextState;
		
				this.nextState = function(ns) {
					_nextState = ns;
				};
		
				this.start = function() {
					obj.colorAll(on);
					setTimeout(function() {
						obj.colorAll(off);
						_nextState.start();
					}, 1000);
				}
			}
		
			$(win.document).ready(function() {
				var sg = ClickShapeGeneratorSingleton.getInstance();
				sg.register('bubbles', BubbleBuilder);
				sg.register('blocks', BlockBuilder);
				sg.setStage($('div'));
				sg.command('cow command');
		
				var red = sg.create(400, 300, 'bubbles');
				red.colorAll('rgba(255,0,0,.25)');
				sg.add(red);
				sg.chainFade(5);
		
				var yellow = sg.create(600, 300, 'bubbles');
				yellow.colorAll('rgba(255,255,0,.25)');
				sg.add(yellow);
				sg.chainFade(5);
		
				var green = sg.create(800, 300, 'bubbles');
				green.colorAll('rgba(0,255,0,.25)');
				sg.add(green);
				sg.chainFade(5);
		
				var rs = new RedState(red),
				ys = new YellowState(yellow),
				gs = new GreenState(green);
		
				rs.nextState(ys);
				ys.nextState(gs);
				gs.nextState(rs);
		
				rs.start();
				
				$(win).click(function(e){
					// var circle = sg.create(e.pageX-25, e.pageY-25, 'bubbles');
					// sg.add(circle);
					flyWeightFader($(e.target));
					sg.command('pig command');
				});
		
				$(document).keypress(function(e) {
					if(e.key === 'b') {
						var canvasFacade = sg.create(Math.floor(Math.random() * win.innerWidth - 100), Math.floor(Math.random()*win.innerHeight - 100), 'blocks');
						sg.add(canvasFacade);
						sg.chainFade(5);
					} else if (e.key === 'c') {
						var canvasFacade = sg.create(Math.floor(Math.random() * win.innerWidth - 100), Math.floor(Math.random()*win.innerHeight - 100), 'bubbles');
						sg.add(canvasFacade);
						sg.chainFade(5);
					} else if (e.key ==='d') {
						sg.move('+=5px', '+=0px');
					} else if (e.key ==='a') {
						sg.move('-=5px', '+=0px');
					} else if (e.key ==='s') {
						sg.move('+=0px', '+=5px');
					} else if (e.key ==='w') {
						sg.move('+=0px', '-=5px');
					} else if (e.key === '1') {
						sg.colorAll('red');
					} else if (e.key === '2') {
						sg.colorAll('blue');
					} else if (e.key === '3') {
						sg.colorAll('orange');
					} else if (e.key === '4') {
						sg.colorAll('green');
					}
				})
			})
		
		})(window, jQuery);