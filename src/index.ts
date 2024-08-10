import { sendTwoBitsWithSDC } from 'library';
import { circuitToImage } from './node/circuitToImage';

const { data, circuit } = sendTwoBitsWithSDC('11');

circuitToImage(circuit);


