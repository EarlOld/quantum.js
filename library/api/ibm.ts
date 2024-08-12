const URL = 'https://api.quantum-computing.ibm.com/runtime/jobs';

export async function runIBMJob(token: string, program: string) {
  const response = await fetch(URL, {
    method: 'POST',
    body: JSON.stringify({
      program_id: 'estimator',
      backend: 'ibmq_qasm_simulator',
      hub: 'ibm-q',
      group: 'open',
      project: 'main',
      params: {
        pubs: [[program]],
        options: { dynamical_decoupling: { enable: true } },
        version: 2,
        resilience_level: 1,
      },
    }),
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.text();
}
