describe("A suite testing the core module", function() {
   describe("tests on messenger (pub/sub) functionality", function() {
      var callbacks = {};

      beforeEach(function() {
         callbacks = {
            handler1: function(event, arg1, arg2) {
               console.log("foo.bar", arg1, arg2);
            },
            handler2: function(event, arg1) {
               console.log("foo", arg1);
            }
         };

         spyOn(callbacks, 'handler1');
         spyOn(callbacks, 'handler2');
      });

      it("should allow for fully qualified subscriptions", function() {
         Scandio.subscribe('foo.bar', callbacks.handler1);
         Scandio.publish('foo.bar');

         expect(callbacks.handler1).toHaveBeenCalled();
         expect(callbacks.handler2).not.toHaveBeenCalled();
      });

      it("should allow for fuzzy (unqualified) subscriptions", function() {
         Scandio.subscribe('foo', callbacks.handler2);
         Scandio.subscribe('foo.bar', callbacks.handler1);

         Scandio.publish('foo');

         expect(callbacks.handler1).toHaveBeenCalled();
         expect(callbacks.handler2).toHaveBeenCalled();
      });

      it("should allow for unsubscribing from messenger", function() {
         Scandio.subscribe('foo.bar', callbacks.handler1);
         Scandio.subscribe('foo', callbacks.handler2);

         Scandio.unsubscribe('foo.bar');
         Scandio.publish('foo');

         expect(callbacks.handler1).not.toHaveBeenCalled();
         expect(callbacks.handler2).toHaveBeenCalled();
      });
   });
});