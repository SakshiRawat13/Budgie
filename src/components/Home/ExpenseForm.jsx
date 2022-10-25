import React, { useContext, useState } from "react";
import { INPUT, COL, BUTTON, LABEL } from "../../styles/twStyles";
import Swal from "sweetalert2";
import { AppContext } from "../../Context/AppContext";
import uuid from "react-uuid";

export default function ExpenseForm() {
	const { dispatch } = useContext(AppContext);
	const [Errors, setErrors] = useState({
		cost: false,
		description: false,
		date: false,
		category: false,
	});
	const [Fields, setFields] = useState({
		cost: 0,
		description: "",
		date: "",
		category: "General",
	});
	const categories = [
		"General",
		"Fuel",
		"Grocery",
		"Entertainement",
		"Shopping",
		"Travel",
		"Food",
	];

	function handleChange(name, value) {
		setFields({ ...Fields, [name]: value });
	}
	function handleSubmit(e) {
		e.preventDefault();
		let flag = 0;
		setErrors({
			cost: false,
			description: false,
			date: false,
			category: false,
		});
		if (
			Fields.cost === 0 ||
			Fields.description.trim() === "" ||
			Fields.date === ""
		) {
			if (Fields.cost === 0) setErrors({ ...Errors, cost: true });
			else
				setErrors({
					...Errors,
					description: true,
					date: true,
				});
			flag = 1;
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: `${
					Fields.cost === 0
						? "Please enter a valid cost number"
						: "All fields must be filled"
				}`,
				confirmButtonColor: "#25292D",
			});
		}
		if (Fields.cost < 0) {
			setErrors({ ...Errors, cost: true });
			flag = 1;
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Invalid Cost",
				confirmButtonColor: "#25292D",
			});
			setFields({ ...Fields, cost: 0 });
		}
		if (Fields.description.length > 25) {
			setErrors({ ...Errors, description: true });
			flag = 1;
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Description is too long",
				confirmButtonColor: "#25292D",
			});
		}
		if (flag === 0) {
			const expense = {
				id: uuid(),
				cost: Number(Fields.cost),
				...Fields,
			};
			dispatch({
				type: "ADD_EXPENSE",
				payload: expense,
			});
		}
	}
	return (
		<form onSubmit={handleSubmit}>
			<div className="flex flex-wrap gap-3 mb-3">
				<div className={COL}>
					<div className="form-control">
						<label htmlFor="cost" className={LABEL}>
							Cost
						</label>
						<input
							type="number"
							placeholder="0.0 DH"
							name="cost"
							value={Fields.cost}
							className={`${INPUT} ${
								Errors.cost === false
									? "focus:ring-2 focus:ring-green-main"
									: "ring-2 ring-red-main"
							}`}
							onChange={(e) =>
								handleChange(e.target.name, e.target.value)
							}
						/>
					</div>
					<div className="form-control">
						<label htmlFor="description" className={LABEL}>
							Description
						</label>
						<input
							type="text"
							placeholder="What was the expense for"
							name="description"
							value={Fields.description}
							className={`${INPUT} ${
								Errors.description === false
									? "focus:ring-2 focus:ring-green-main"
									: "ring-2 ring-red-main"
							}`}
							max="25"
							onChange={(e) =>
								handleChange(e.target.name, e.target.value)
							}
						/>
					</div>
				</div>
				<div className={COL}>
					<div className="form-control">
						<label htmlFor="date" className={LABEL}>
							Date
						</label>
						<input
							type="date"
							name="date"
							value={Fields.date}
							className={`${INPUT} ${
								Errors.date === false
									? "focus:ring-2 focus:ring-green-main"
									: "ring-2 ring-red-main"
							}`}
							onChange={(e) =>
								handleChange(e.target.name, e.target.value)
							}
						/>
					</div>
					<div className="form-control">
						<label htmlFor="category" className={LABEL}>
							Category
						</label>
						<select
							name="category"
							className={`${INPUT} ${
								Errors.category === false
									? "focus:ring-2 focus:ring-green-main"
									: "ring-2 ring-red-main"
							}`}
							onChange={(e) =>
								handleChange(e.target.name, e.target.value)
							}
						>
							{categories.map((cat, i) => (
								<option value={cat} key={i}>
									{cat}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>
			<button className={BUTTON}>Add</button>
			<hr className="mt-3" />
		</form>
	);
}
