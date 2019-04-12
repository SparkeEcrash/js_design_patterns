//PROBLEM: Remove all access to private variables except from within the scope where it is needed

const publicString = "string that is public",
publicInteger = 23,
publicFunction = () => {
    console.log('function that is publc that has access to the publicInteger (' + publicInteger + ') and the publicString (' + publicString + ') and the privateInteger (' + privateInteger + ') and the privateString (' + privateString + ') and the privateFunction (' + privateFunction() + ')')
};

const privateString = "string that is private",
privateInteger = 16,
privateFunction = () => 'this is from the private function';


//SOLUTION: Use the Module Reveal Pattern with access to only the public variables from the browser window

(function(win, doc, $){
    const sudoModule = (function() {
        const publicString = 'string that is public';
        const publicInteger = 23;
        const _privateString = 'string that is private';
        const _privateInteger = 15;
        const publicFunction = function() {
            console.log('function that is publc that has access to the publicInteger (' + publicInteger + ') and the publicString (' + publicString + ') and the privateInteger (' + _privateInteger + ') and the privateString (' +_privateString + ') and the privateFunction (' + _privateFunction() + ')')
        };
        const _privateFunction = function() {
            return 'this is from the private function'
        }
        return {
            //return all the public variables but not the private ones
            publicString,
            publicInteger,
            publicFunction
            }
        }
    )();
    $(doc).ready(function() {
        sudoModule.publicFunction()
    })

    if(!win.sudoModule) win.sudoModule = sudoModule;
})(window, document, jQuery);

//access the public function from the window scope with the below line
// window.sudoModule.publicFunction();