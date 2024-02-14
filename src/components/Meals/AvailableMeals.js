import { useEffect, useState } from 'react';
import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';
import classes from './AvailableMeals.module.css';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDcD4VZKLfhqyn4piLr8763HuK1OGVvvzU",
  authDomain: "food-order-17bae.firebaseapp.com",
  databaseURL: "https://food-order-17bae-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "food-order-17bae",
  storageBucket: "food-order-17bae.appspot.com",
  messagingSenderId: "214674901418",
  appId: "1:214674901418:web:0c3cac50fb6d05ee4f43d3",
  measurementId: "G-65MS094R7J"
};

// Initialize Firebase
initializeApp(firebaseConfig);

const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState();


  useEffect(() => {
    const fetchMeals = async () => {
      const dbRef = ref(getDatabase());
      await get(child(dbRef, `meals`)).then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          setMeals(Object.values(snapshot.val()));
        } else {
          console.log("No data available");
          setHttpError(true);
        }
      }).catch((error) => {
        console.error(error);
        setIsLoading(false);
        setHttpError(error.message);
      });
      setIsLoading(false);
    }

    fetchMeals();
  }, []);

  if (httpError) {
    return (
      <section className={classes.MealsError}>
        <p>data not found</p>
      </section>
    );
  }

  const mealsList = meals.map((meal) => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  return (
    <>
      {isLoading ? <p className={classes.loading}>Loading...</p> :
        <section className={classes.meals}>
          <Card>
            <ul>{mealsList}</ul>
          </Card>
        </section>}
    </>
  );
};

export default AvailableMeals;
