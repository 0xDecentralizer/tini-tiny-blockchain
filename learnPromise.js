let number = 0;

function firstSum(num) {
    return new Promise((resolve) => {
        console.log(`Fitst sum with ${num}`);

        number += num;
        resolve(number);
    });
}

function secondSum(num) {
    return new Promise((resolve) => {
        console.log(`Second sum with ${num}`);

        number += num;
        resolve(number);
    });
}

function thirdSum(num) {
    return new Promise((resolve) => {
        console.log(`Third sum with ${num}`);

        number += num;
        resolve(number);
    });
}

console.log('************* START *************');
console.log(`Number: ${number}`);
firstSum(1)
    .then((res) => secondSum(res))
    .then((res2) => thirdSum(res2))
    .then(() => {
        console.log(`Final result: ${number}`);
    })
    .catch((err) => {
        console.log(`Error: ${err}`);
    });
    
console.log('************* END *************');






doSomethingCritical()
  .then((result) => doSomethingOptional(result)
      .then((optionalResult) => doSomethingExtraNice(optionalResult))
      .catch((e) => {}),
  ) // Ignore if optional stuff fails; proceed.
  .then(() => moreCriticalStuff())
  .catch((e) => console.error(`Critical failure: ${e.message}`));

async function job() {
    try {
        const result = await doSomethingCritical();
        
        try {
            const optionalResult = await doSomethingOptional(result);
            await doSomethingExtraNice(optionalResult);
        } catch (e) {}
        
        await moreCriticalStuff();
    } catch (e) {
        console.error(`Critical failure: ${e.message}`);
    }
}


doSomething()
  .then(() => {
    throw new Error("Something failed");

    console.log("Do this");
  })
  .catch(() => {
    console.error("Do that");
  })
  .then(() => {
    console.log("Do this, no matter what happened before");
  });

async function main() {
    try {
        await doSomething();
        throw new Error("Something failed");
        console.log("Do this");
    } catch {
        console.error("Do that"); 
    }
    console.log("Do thisssssssssss");
}