import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import Image from 'next/legacy/image'
import React from 'react'
import { useSelector } from 'react-redux'
import CheckoutProduct from '../components/CheckoutProduct'
import Header from '../components/Header'
import { selectItems, selectTotal } from '../slices/basketSlice'

const stripePromise = loadStripe(process.env.stripe_public_key)

const Checkout = () => {
    const items = useSelector(selectItems)
    const total = useSelector(selectTotal)
    const {data: session} = useSession();

    const createCheckoutSession = async () => {
        const stripe = await stripePromise;

        //call the backend to create checkout session
        const checkoutSession = await axios.post('/api/create-checkout-session', {
            items: items,
            email: session.user.email,
        })

        //Redirect customer to stipe checkout
        const result = await stripe.redirectToCheckout({
            sessionId: checkoutSession.data.id
        })

        if(result.error){
            alert(result.error.message);
        }

        
    }

    return (
        <div className='bg-gray-100'>
            <Header />

            <main className='lg:flex max-w-screen-2xl mx-auto'>
                {/* Left */}
                <div>
                    <Image
                        src='/chekoutposter.png'
                        width={1020}
                        height={250}
                        objectFit='contain'
                    />

                    <div className='flex flex-col p-5 space-y-10 bg-white'>
                        <h1 className="text-3xl border-b pb-4">{items.length === 0 ? 'Your amazon basket is empty' : 'Shopping Basket'}</h1>

                        {items.map((item, i) => (
                            <CheckoutProduct
                                key={i}
                                id={item.id}
                                title={item.title}
                                rating={item.rating}
                                price={item.price}
                                description={item.description}
                                category={item.category}
                                image={item.image}
                                hasPrime={item.hasPrime}
                            />
                        ))}
                    </div>
                </div>

                {/* Right */}
                <div className='flex flex-col bg-white p-10 shadow-md'>
                    {items.length > 0 && (
                        <>
                        <h2 className="whietspace-nowrap">
                            Subtotal ({items.length} items):{" "}
                            <span className="font-bold">${total}</span>
                        </h2>

                        <button role='link' onClick={createCheckoutSession} disabled={!session} className={`button mt-2 ${!session && "from-gray-200 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed"}`}>{!session ? "Sign In to checkout" : "Proceed to checkout"}</button>
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}

export default Checkout