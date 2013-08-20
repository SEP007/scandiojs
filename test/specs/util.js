describe("A suite testing the utility functions", function() {
   var obj = null;
   var temp = null;

   beforeEach(function() {
      temp = null;
      obj = {
         str: "string",
         some: 1,
         func: function() {
           return "string";
         },
         arr: [2, 4, 13]
      };
   });

   describe("tests on object properties", function() {
      it("should return correctly check on object props", function() {
          expect(ß.util.has(obj, "str")).toBe(true);
          expect(ß.util.has(obj, "some")).toBe(true);
          expect(ß.util.has(obj, "func")).toBe(true);
      });

      it("should not assume unexistent props on an object", function() {
          expect(ß.util.has(obj, "str2")).toBe(false);
          expect(ß.util.has(obj, "func2")).toBe(false);
      });
   });

   describe("tests on object iteration with each", function() {
      it("give a proper value and iteration count", function() {
         ß.util.each([1, 2, 3], function(num, i) {
            expect(num).toEqual(i + 1);
         });
      });

      it("should iterate properly over object-hashes not the prototype", function() {
         obj = { one : 1, two : 2, three : 3 };
         obj.constructor.prototype.four = 4;
         temp = [];

         ß.util.each(obj, function(value, key) {
            temp.push(key);
         });

         expect(temp.join(", ")).toEqual("one, two, three");
      });

      it("should handle null props", function() {
         temp = 42;

         ß.util.each(null, function(value, key) {
            temp = value;
         });

         expect(temp).toEqual(42);
      });
   });

   describe("tests on filtering objects", function() {
      it("should filter values of an object", function() {
         temp = ß.util.filter(obj, function(prop) {
            return prop === 1;
         });

         expect(temp).toContain(1);
         expect(temp).not.toContain("string");
      });

      it("should filter values of an array", function() {
         temp = ß.util.filter(obj.arr, function(num) {
            return num % 2 == 0;
         });

         expect(temp).toContain(2);
         expect(temp).toContain(4);
         expect(temp).not.toContain(13);
      });
   });

   describe("tests on mixing in another module", function() {
      it("should mixin function of a passed object", function() {
         ß.util.mixin("string", {
           capitalize : function(string) {
             return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
           }
         });

         expect(ß.string).toBeDefined();
         expect(ß.string.capitalize("yay")).toEqual("Yay");
      });

      it("should not mixin anything except an function", function() {
         ß.util.mixin("string", {
           lowercase : function(string) {
             return string.toLowerCase();
           },
           another : "maybe is around"
         });

         expect(ß.string).toBeDefined();
         expect(ß.string.another).not.toBeDefined();

         expect(ß.string.lowercase).toEqual(jasmine.any(Function));
         expect(ß.string.lowercase("Yay")).toEqual("yay");
      });
   });

   describe("tests on getting functions of an object", function() {
      it("should only return functions", function() {
         temp = ß.util.functions(obj);

         ß.util.each(temp, function(value, key) {
            expect(value).toEqual(jasmine.any(Function));
         });
      });
   });

   describe("tests on accessing object and arrays using dot notation", function() {
      it("should access nesting properties on an object", function() {
         temp = {name: {firstname: "Scandio", lastname: "GmbH"}, location: "München"};

         expect(ß.util.dots("name.firstname", temp)).toEqual("Scandio");
      });

      it("should use a default value if the prop is not found", function() {
         temp = {name: {firstname: "Scandio", lastname: "GmbH"}, location: "München"};

         expect(ß.util.dots("name.firstname.none", temp, null)).toBe(null);
      });

      it("should access nesting properties on an array", function() {
         temp = [];
         temp["name"] = [];
         temp["name"]["firstname"] = "Scandio";
         temp["name"]["lastname"] = "GmbH";
         temp["location"] = "München";

         expect(ß.util.dots("name.firstname", temp)).toEqual("Scandio");
      });

      it("should use a default value if the prop is not found", function() {
         temp = [];
         temp["name"] = [];
         temp["name"]["firstname"] = "Scandio";
         temp["name"]["lastname"] = "GmbH";
         temp["location"] = "München";

         expect(ß.util.dots("name.firstname.none", temp, null)).toBe(null);
      });
   });

   describe("tests extending a source with a destination object", function() {
      it("should extend an object's attributes with another one", function() {
         temp = ß.util.extend({}, {a:"b"});
         expect(temp.a).toBeDefined();
      });

      it("should overwrite destination with source", function() {
         temp = ß.util.extend({a:"x"}, {a:"b"});
         expect(temp.a).toEqual("b");
      });

      it("should not overwrite existent properties in source", function() {
         temp = ß.util.extend({x:"x"}, {a:"a"});
         expect(temp.x).toEqual("x");
         expect(temp.a).toEqual("a");
      });

      it("should extend from multiple object where last value wins", function() {
         temp = ß.util.extend({x:"x"}, {a:"a", x:2}, {a:"b"});
         expect(temp.a).toEqual("b");
      });

      it("should not extend undefined values but nulled ones", function() {
         temp = ß.util.extend({}, {a: void 0, b: null});
         expect(temp.a).not.toBeDefined();
         expect(temp.b).toBeDefined();
      });
   });

   describe("tests on delaying a function call for n-milliseconds", function() {
      it("should defer the execution of a function", function() {
         runs(function() {
            this.hasBeenCalled = false;
            var that = this;

            ß.util.delay(function() {
               that.hasBeenCalled = true;
            }, 50);
         });

         runs(function() {
            expect(this.hasBeenCalled).toBe(false);
         });

         waits(100);

         runs(function() {
            expect(this.hasBeenCalled).toBe(true);
         });
      });
   });

   describe("tests on putting the breaks on a function call for n-milliseconds", function() {
      it("should break the execution of a function", function() {
         runs(function() {
            this.counter = 0;

            this.breakedIncrementor = ß.util.breaks(function() {
               this.counter++;
            }, 42);

            this.breakedIncrementor();
            this.breakedIncrementor();

            //Not called
            expect(this.counter).toEqual(0);
         });

         waits(50);

         runs(function() {
            expect(this.counter).toEqual(1);
         });
      });

      it("should break the execution of a function with arguments", function() {
         runs(function() {
            this.counter = 0;

            this.breakedIncrementor = ß.util.breaks(function(to) {
               this.counter = to;
            }, 10);

            this.breakedIncrementor(5);
            this.breakedIncrementor(10);

            //Not called
            expect(this.counter).toEqual(0);

            ß.util.delay(function() {
               //Called once now
               expect(that.counter).toEqual(5);
            }, 15);
         });

         waits(15);

         runs(function() {
            expect(this.counter).toEqual(10);
         });
      });
   });
});