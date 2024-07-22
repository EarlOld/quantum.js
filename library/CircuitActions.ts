export class CircuitActions {
  private actions: string[][] = [];

  constructor(qubitCount: number) {
    this.actions = Array.from({ length: qubitCount }, () => []);
  }

  public h(qubitIndex?: number): void {
    if (qubitIndex === undefined) {
      this.actions.forEach((action) => action.push('H'));
    } else {
      this.actions.forEach((action, index) => {
        if (index === qubitIndex) {
          action.push('H');
        } else {
          action.push('');
        }
      });
    }
  }

  public x(qubitIndex?: number): void {
    if (qubitIndex === undefined) {
      this.actions.forEach((action) => action.push('X'));
    } else {
      this.actions.forEach((action, index) => {
        if (index === qubitIndex) {
          action.push('X');
        } else {
          action.push('');
        }
      });
    }
  }

  public y(qubitIndex?: number): void {
    if (qubitIndex === undefined) {
      this.actions.forEach((action) => action.push('Y'));
    } else {
      this.actions.forEach((action, index) => {
        if (index === qubitIndex) {
          action.push('Y');
        } else {
          action.push('');
        }
      });
    }
  }

  public z(qubitIndex?: number): void {
    if (qubitIndex === undefined) {
      this.actions.forEach((action) => action.push('Z'));
    } else {
      this.actions.forEach((action, index) => {
        if (index === qubitIndex) {
          action.push('Z');
        } else {
          action.push('');
        }
      });
    }
  }

  public t(qubitIndex?: number): void {
    if (qubitIndex === undefined) {
      this.actions.forEach((action) => action.push('Z'));
    } else {
      this.actions.forEach((action, index) => {
        if (index === qubitIndex) {
          action.push('T');
        } else {
          action.push('');
        }
      });
    }
  }

  public getActions(): string[][] {
    return this.actions;
  }

  public printActions(): void {
    this.actions.forEach((action, index) => {
      console.log(`${index}>: ${action.join('---')}`);
    });
  }

  public toQsharp(): string {
    const code = `
    namespace Test {
        @EntryPoint()
        operation MyEntry() : Result {
          use register = Qubit[${this.actions.length}];
          ${this.actions.map((action, index) => {
             
          })

          }
          H(register[0]);
            
            return M(q1);
        }
    }`;

    return code;
  }
}
