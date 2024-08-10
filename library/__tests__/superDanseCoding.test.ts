import { sendTwoBitsWithSDC } from '../index';

describe('SDC', () => {
  it('send two qubits: 11 ', () => {
    const { data } = sendTwoBitsWithSDC('11');

    expect(data).toEqual('11');
  });

  it('send two qubits: 10 ', () => {
    const { data } = sendTwoBitsWithSDC('10');

    expect(data).toEqual('10');
  });

  it('send two qubits: 01 ', () => {
    const { data } = sendTwoBitsWithSDC('01');

    expect(data).toEqual('01');
  });

  it('send two qubits: 00 ', () => {
    const { data } = sendTwoBitsWithSDC('00');

    expect(data).toEqual('00');
  });
});
