var pl;
(function( pl ) {
    // Name of the module
    var name = "my_module";
    // Object with the set of predicates, indexed by indicators (name/arity)
    var predicates = function() {
        return {
            // p/1
            "p/1": function( thread, point, atom ) {
                var lower = atom.args[0], upper = atom.args[1], rand = atom.args[2];
                if( pl.type.is_variable( lower ) || pl.type.is_variable( upper ) ) {
                    thread.throw_error( pl.error.instantiation( atom.indicator ) );
                } else if( !pl.type.is_number( lower ) ) {
                    thread.throw_error( pl.error.type( "number", lower, atom.indicator ) );
                } else if( !pl.type.is_number( upper ) ) {
                    thread.throw_error( pl.error.type( "number", upper, atom.indicator ) );
                } else if( !pl.type.is_variable( rand ) && !pl.type.is_number( rand ) ) {
                    thread.throw_error( pl.error.type( "number", rand, atom.indicator ) );
                } else {
                    if( lower.value < upper.value ) {
                        var float = lower.is_float || upper.is_float;
                        var gen = lower.value + Math.random() * (upper.value - lower.value);
                        if( !float )
                            gen = Math.floor( gen );
                        thread.prepend( [new pl.type.State(
                            point.goal.replace( new pl.type.Term( "=", [rand, new pl.type.Num( gen, float )] ) ),
                            point.substitution,
                            point 
                        )] );
                    }
                }
            },
            // q/2
            "rainbow/2": function(thread, point, atom) { 
                console.log("afd","afs");
                var wind = atom.args[0], light = atom.args[1];
                
             }
        };
    };
    // List of predicates exported by the module
    var exports = ["p/1", "rainbow/2" /** , ... */];
    // DON'T EDIT
    if( typeof module !== 'undefined' ) {
        module.exports = function(tau_prolog) {
            pl = tau_prolog;
            new pl.type.Module( name, predicates(), exports );
        };
    } else {
        new pl.type.Module( name, predicates(), exports );
    }
})( pl );