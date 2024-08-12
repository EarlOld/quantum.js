import { sendTwoBitsWithSDC } from 'library';
import { circuitToImage } from './node/circuitToImage';

const main = async () => {
  const { data, circuit } = sendTwoBitsWithSDC('11');

  console.log(circuit.toQASM());

  console.log(await circuit.runOnIBM(process.env.IBM_API_KEY as string));

  circuitToImage(circuit);
};

main();
