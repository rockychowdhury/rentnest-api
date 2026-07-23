import Stripe from "stripe";
import config from "../config";

const stripe_api_key = config.stripe_secret_key
const stripe = new Stripe(stripe_api_key)

export {stripe}