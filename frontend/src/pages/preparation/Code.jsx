import React, {useRef, useEffect, useState} from "react";
import CodingPreparationDisplay from "../../components/CodingPreparationDisplay";
function Code(){
    let reference = useRef(null)
    const [topic, setTopic] = useState("default");
    function handleChange(){
        if(reference && reference.current.value !== "default"){
            setTopic(reference.current.value)
            console.log(reference.current.value)
        }    
        }
    return(
        <>
            {/* <h1 className="text-center text-3xl p-4">Code</h1> */}
            <div className="flex align-middle text-center justify-center mt-8">
                <select
                    id="codingConcept"
                    className="items-center  border-3 border-gray-300 rounded-l-3xl rounded-b-3xl px-2 py-2 shadow-md mb-2"
                    ref={reference}
                    onChange={handleChange}>
                    <option value="default">Select a Concept</option>
                    <optgroup label="Coding Strategies">
                        <option value="Brute Force">Brute Force</option>
                        <option value="Greedy Algorithm">Greedy Algorithm</option>
                        <option value="Divide and Conquer">Divide and Conquer</option>
                        <option value="Dynamic Programming">Dynamic Programming</option>
                        <option value="Backtracking">Backtracking</option>
                        <option value="Recursion">Recursion</option>
                        <option value="Sliding Window">Sliding Window</option>
                        <option value="Two Pointers">Two Pointers</option>
                        <option value="Binary Search">Binary Search</option>
                        <option value="DFS">Depth First Search (DFS)</option>
                        <option value="BFS">Breadth First Search (BFS)</option>
                        <option value="Bit Manipulation">Bit Manipulation</option>
                        <option value="Union Find">Union Find / Disjoint Set</option>
                        <option value="Topological Sort">Topological Sort</option>
                        <option value="Prefix Sum">Prefix Sum</option>
                        <option value="Hashing">Hashing</option>
                        <option value="Trie">Trie-based Approach</option>
                        <option value="Memoization">Memoization</option>
                        <option value="Kadane">Kadane's Algorithm</option>
                    </optgroup>

                    <optgroup label="Data Structures">
                        <option value="Array">Array</option>
                        <option value="String">String</option>
                        <option value="Linked List">Linked List</option>
                        <option value="Stack">Stack</option>
                        <option value="Queue">Queue</option>
                        <option value="Deque">Deque</option>
                        <option value="HashMap">HashMap / Dictionary</option>
                        <option value="Set">Set / HashSet</option>
                        <option value="Tree">Tree</option>
                        <option value="Binary Search Tree">Binary Search Tree (BST)</option>
                        <option value="Heap">Heap / Priority Queue</option>
                        <option value="Graph">Graph</option>
                        <option value="TrieDS">Trie</option>
                        <option value="Matrix">Matrix</option>
                        <option value="Segment Tree">Segment Tree</option>
                        <option value="Fenwick Tree">Fenwick Tree / Binary Indexed Tree</option>
                    </optgroup>
                </select>
            </div>
            <CodingPreparationDisplay topic={topic}/>
        </>
    )
}
export default Code