"use client";

import { useState } from "react";
import { useBudget } from "@/context/BudgetContext";
import styles from "./AddExpense.module.css";

export default function AddExpense() {

const { addExpense } = useBudget();

const [name,setName]=useState("");

const [amount,setAmount]=useState("");

const [category,setCategory]=useState("Food");

function submit(){

if(!name||!amount)return;

addExpense({

name,

amount:Number(amount),

category

});

setName("");

setAmount("");

}

return(

<div className={styles.box}>

<h2>Add Expense</h2>

<input

placeholder="Expense Name"

value={name}

onChange={(e)=>setName(e.target.value)}

/>

<input

placeholder="Amount"

type="number"

value={amount}

onChange={(e)=>setAmount(e.target.value)}

/>

<select

value={category}

onChange={(e)=>setCategory(e.target.value)}

>

<option>Food</option>

<option>Shopping</option>

<option>Transport</option>

<option>Bills</option>

<option>Entertainment</option>

</select>

<button onClick={submit}>

Add

</button>

</div>

)

}