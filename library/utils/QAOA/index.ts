import { Circuit } from '../../circuit';

function appendZZTerm(qc: Circuit, q1: number, q2: number, gamma: number) {
    qc.cx(q1, q2);
    qc.rz(2 * gamma, q2);
    qc.cx(q1, q2);
}

function appendCostOperatorCircuit(qc: Circuit, edges: Array<[number, number, number]>, gamma: number) {
    for (const [i, j, weight] of edges) {
        appendZZTerm(qc, i, j, gamma * weight);
    }
}

function appendXTerm(qc: Circuit, q: number, beta: number) {
    qc.rx(2 * beta, q);
}

function appendMixerOperatorCircuit(qc: Circuit, nodes: Array<number>, beta: number) {
    for (const n of nodes) {
        appendXTerm(qc, n, beta);
    }
}

export function getQAOACircuit(nodes: Array<number>, edges: Array<[number, number, number]>, beta: Array<number>, gamma: Array<number>): Circuit {
    const p = beta.length; // Кількість QAOA кроків
    const qc = new Circuit(nodes.length);
    
    // Перший крок: застосувати шар Гадамардових воріт
    nodes.forEach(node => qc.h(node));
    
    // Другий крок: застосувати p чергуючих операторів
    for (let i = 0; i < p; i++) {
        appendCostOperatorCircuit(qc, edges, gamma[i]);
        appendMixerOperatorCircuit(qc, nodes, beta[i]);
    }
    
    // Останній крок: виміряти результат
    nodes.forEach(node => qc.measure(node));
    
    return qc;
}