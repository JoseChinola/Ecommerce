import stripe from 'stripe'
import { STRIPE_SECRET_KEY } from '../config.js'



const Stripe = stripe(STRIPE_SECRET_KEY)



export default Stripe