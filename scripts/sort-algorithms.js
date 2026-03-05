"use strict";
class sortAlgorithms {
    constructor(time) {
        this.list = document.querySelectorAll(".cell");
        this.size = this.list.length;
        this.time = time;
        this.help = new Helper(this.time, this.list);
    }

    // BUBBLE SORT
    BubbleSort = async () => {
        for(let i = 0 ; i < this.size - 1 ; ++i) {
            let swapped = false;
            for(let j = 0 ; j < this.size - i - 1 ; ++j) {
                await this.help.mark(j);
                await this.help.mark(j+1);
                if(await this.help.compare(j, j+1)) {
                    await this.help.swap(j, j+1);
                    swapped = true;
                }
                await this.help.unmark(j);
                await this.help.unmark(j+1);
            }
            this.list[this.size - i - 1].setAttribute("class", "cell done");
            if(!swapped) {
                for(let counter = 0 ; counter < this.size - i - 1 ; ++counter) {
                    this.list[counter].setAttribute("class", "cell done");
                }
                return;
            }
        }
        this.list[0].setAttribute("class", "cell done");
    }

    // INSERTION SORT
    InsertionSort = async () => {
        for(let i = 0 ; i < this.size - 1 ; ++i) {
            let j = i;
            while(j >= 0 && await this.help.compare(j, j+1)) {
                await this.help.mark(j);
                await this.help.mark(j+1);
                await this.help.pause();
                await this.help.swap(j, j+1);
                await this.help.unmark(j);
                await this.help.unmark(j+1);
                j -= 1;
            }
        }
        for(let counter = 0 ; counter < this.size ; ++counter) {
            this.list[counter].setAttribute("class", "cell done");
        }
    }

    // SELECTION SORT
    SelectionSort = async () => {
        for(let i = 0 ; i < this.size ; ++i) {
            let minIndex = i;
            for(let j = i ; j < this.size ; ++j) {
                await this.help.markSpl(minIndex);
                await this.help.mark(j);
                if(await this.help.compare(minIndex, j)) {
                    await this.help.unmark(minIndex);
                    minIndex = j;
                }
                await this.help.unmark(j);
                await this.help.markSpl(minIndex);
            }
            await this.help.mark(minIndex);
            await this.help.mark(i);
            await this.help.pause();
            await this.help.swap(minIndex, i);
            await this.help.unmark(minIndex);
            this.list[i].setAttribute("class", "cell done");
        }
    }

    // MERGE SORT
    MergeSort = async () => {
        await this.MergeDivider(0, this.size - 1);
        for(let counter = 0 ; counter < this.size ; ++counter) {
            this.list[counter].setAttribute("class", "cell done");
        }
    }

    MergeDivider = async (start, end) => {
        if(start < end) {
            let mid = start + Math.floor((end - start)/2);
            await this.MergeDivider(start, mid);
            await this.MergeDivider(mid+1, end);
            await this.Merge(start, mid, end);
        }
    }

    Merge = async (start, mid, end) => {
        let newList = new Array();
        let frontcounter = start;
        let midcounter = mid + 1;
        
        while(frontcounter <= mid && midcounter <= end) {
            let fvalue = Number(this.list[frontcounter].getAttribute("value"));
            let svalue = Number(this.list[midcounter].getAttribute("value"));
            if(fvalue >= svalue) {
                newList.push(svalue);
                ++midcounter;
            }
            else {
                newList.push(fvalue);
                ++frontcounter;
            }
        }
        while(frontcounter <= mid) {
            newList.push(Number(this.list[frontcounter].getAttribute("value")));
            ++frontcounter;
        }
        while(midcounter <= end) {
            newList.push(Number(this.list[midcounter].getAttribute("value")));
            ++midcounter;
        }

        for(let c = start ; c <= end ; ++c) {
            this.list[c].setAttribute("class", "cell current");
        }
        for(let c = start, point = 0 ; c <= end && point < newList.length; 
            ++c, ++point) {
                await this.help.pause();
                this.list[c].setAttribute("value", newList[point]);
                this.list[c].style.height = `${3.5*newList[point]}px`;
        }
        for(let c = start ; c <= end ; ++c) {
            this.list[c].setAttribute("class", "cell");
        }
    }

    // QUICK SORT
    QuickSort = async () => {
        await this.QuickDivider(0, this.size-1);
        for(let c = 0 ; c < this.size ; ++c) {
            this.list[c].setAttribute("class", "cell done");
        }
    }

    QuickDivider = async (start, end) => {
        if(start < end) {
            let pivot = await this.Partition(start, end);
            await this.QuickDivider(start, pivot-1);
            await this.QuickDivider(pivot+1, end);
        }
    }

    Partition = async (start, end) => {
        let pivot = Number(this.list[end].getAttribute("value"));
        let prev_index = start - 1;

        await this.help.markSpl(end);
        for(let c = start ; c < end ; ++c) {
            let currValue = Number(this.list[c].getAttribute("value"));
            await this.help.mark(c);
            if(currValue < pivot) {
                prev_index += 1;
                await this.help.mark(prev_index);
                await this.help.swap(c, prev_index);
                await this.help.unmark(prev_index);
            }
            await this.help.unmark(c);
        }
        await this.help.swap(prev_index+1, end);
        await this.help.unmark(end);
        return prev_index + 1;
    }

    // HEAP SORT
    HeapSort = async () => {
        for(let i = Math.floor(this.size / 2) - 1 ; i >= 0 ; --i) {
            await this.heapify(this.size, i);
        }

        for(let end = this.size - 1 ; end > 0 ; --end) {
            await this.help.mark(0);
            await this.help.mark(end);
            await this.help.pause();
            await this.help.swap(0, end);
            await this.help.unmark(0);
            await this.help.unmark(end);
            this.list[end].setAttribute("class", "cell done");
            await this.heapify(end, 0);
        }
        this.list[0].setAttribute("class", "cell done");
    }

    heapify = async (heapSize, rootIndex) => {
        let largest = rootIndex;

        while(true) {
            let left = 2 * largest + 1;
            let right = 2 * largest + 2;
            let candidate = largest;

            if(left < heapSize) {
                await this.help.mark(left);
                await this.help.mark(candidate);
                let leftValue = Number(this.list[left].getAttribute("value"));
                let currentMax = Number(this.list[candidate].getAttribute("value"));
                if(leftValue > currentMax) {
                    candidate = left;
                }
                await this.help.unmark(left);
                await this.help.unmark(largest);
            }

            if(right < heapSize) {
                await this.help.mark(right);
                await this.help.mark(candidate);
                let rightValue = Number(this.list[right].getAttribute("value"));
                let currentMax = Number(this.list[candidate].getAttribute("value"));
                if(rightValue > currentMax) {
                    candidate = right;
                }
                await this.help.unmark(right);
                await this.help.unmark(candidate);
            }

            if(candidate === largest) {
                break;
            }

            await this.help.mark(largest);
            await this.help.mark(candidate);
            await this.help.pause();
            await this.help.swap(largest, candidate);
            await this.help.unmark(largest);
            await this.help.unmark(candidate);
            largest = candidate;
        }
    }


    // SHELL SORT
    ShellSort = async () => {
        for(let gap = Math.floor(this.size / 2); gap > 0; gap = Math.floor(gap / 2)) {
            for(let i = gap; i < this.size; ++i) {
                let j = i;
                while(j - gap >= 0) {
                    await this.help.mark(j);
                    await this.help.mark(j-gap);
                    let current = Number(this.list[j].getAttribute("value"));
                    let compareWith = Number(this.list[j-gap].getAttribute("value"));
                    if(compareWith > current) {
                        await this.help.pause();
                        await this.help.swap(j, j-gap);
                        await this.help.unmark(j);
                        await this.help.unmark(j-gap);
                        j -= gap;
                    }
                    else {
                        await this.help.unmark(j);
                        await this.help.unmark(j-gap);
                        break;
                    }
                }
            }
        }

        for(let counter = 0 ; counter < this.size ; ++counter) {
            this.list[counter].setAttribute("class", "cell done");
        }
    }

};
