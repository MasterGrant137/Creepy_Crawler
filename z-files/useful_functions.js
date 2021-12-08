const branchPruner = (branches) => {
    branches.forEach((branch) => {
        console.log(`git branch -D ${branch}`);
    })
}

branchPruner([])