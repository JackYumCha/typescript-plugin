interface TscDebugger {
    ControlFlow?: boolean;
    StackLevel?: number;
    enter?: (name: string, ...actions: (string | string[])[]) => void;
    exit?: (name: string, ...actions: (string | string[])[]) => void;
    comment?: (name: string, ...actions: (string | string[])[]) => void;
}

var tscDebugger: TscDebugger = {
    ControlFlow: false,
    StackLevel: 0
};
tscDebugger.enter = (name: string, ...actions: (string | string[])[]) => {
    if (!tscDebugger.ControlFlow) return; 
    let indent: string = '';
    for (let i = 0; i < tscDebugger.StackLevel; i++) {
        indent += '\t';
    }
    console.log(indent +'<' +name + '>' + actions.map(action => {
        if (Array.isArray(action)) return (<string[]>action).join(', ');
        return action;
    }).join(''));
    tscDebugger.StackLevel += 1;
};
tscDebugger.exit = (name: string, ...actions: (string | string[])[]) => {
    if (!tscDebugger.ControlFlow) return;
    tscDebugger.StackLevel -= 1;
    let indent: string = '';
    for (let i = 0; i < tscDebugger.StackLevel; i++) {
        indent += '\t';
    }
    console.log(indent + '</' + name + '>' /*+ actions.map(action => {
        if (Array.isArray(action)) return (<string[]>action).join(', ');
        return action;
    }).join('')*/);
};
tscDebugger.comment = (name: string, ...actions: (string | string[])[]) => {
    if (!tscDebugger.ControlFlow) return; 
    let indent: string = '';
    for (let i = 0; i < tscDebugger.StackLevel; i++) {
        indent += '\t';
    }
    console.log(indent + '####' + name + ': ' + actions.map(action => {
        if (Array.isArray(action)) return (<string[]>action).join(', ');
        return action;
    }).join(''));
};