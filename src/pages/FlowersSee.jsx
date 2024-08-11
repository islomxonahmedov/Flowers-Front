import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { flowerFailure, flowerStart, flowerSuccess } from "../redux/slice/flowersSlice";
import Service from "../config/servis";
import Comments from './Comments';  // Import qilingan Comments komponenti

const FlowersInfo = () => {
    const { flowers, isLoading } = useSelector(state => state.flower);
    const { id } = useParams();
    const dispatch = useDispatch();

    const [selectedImage, setSelectedImage] = useState("");

    const getOneFlowersFunction = async (authId) => {
        try {
            dispatch(flowerStart());
            const { data } = await Service.getOneFlowers(id);
            dispatch(flowerSuccess({ data, type: "a" }));
            setSelectedImage(data.img[0]);
        } catch (error) {
            dispatch(flowerFailure());
            console.log(error);
        }
    };

    useEffect(() => {
        getOneFlowersFunction();
    }, [id]);

    return (
        <div className="px-32 pt-16 pb-28">
            {
                isLoading || !flowers ? "Loading" :
                    <div className="flex flex-col gap-10">
                        <div className="flex border rounded-xl overflow-hidden bg-white shadow-lg">
                            {flowers?.img && Array?.isArray(flowers?.img) && flowers?.img?.length > 0 ? (
                                <div className="p-2">
                                    {flowers.img.map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            alt=""
                                            className="w-30 h-20 mx-auto cursor-pointer"
                                            onClick={() => setSelectedImage(img)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p>Rasm mavjud emas</p>
                            )}
                            <figure className="w-fit flex flex-col items-end rounded-md bg-[#F4F4FF]">
                                {selectedImage ? (
                                    <img
                                        src={selectedImage}
                                        alt=""
                                        className="w-96 h-96 mx-auto filter brightness-100"
                                    />
                                ) : (
                                    <p>Rasm mavjud emas</p>
                                )}
                            </figure>
                            <div className="w-full flex flex-col justify-between gap-4 p-4 text-xl">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <h1 className="text-3xl">{flowers?.nomi}</h1>
                                    </div>
                                    <div className="flex gap-6 mt-2">
                                        <h1>Narxi: <b>{flowers?.narxi}$</b></h1>
                                        <h1>Turi: <b>{flowers?.cat?.nomi}</b></h1>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="">O'simlik hajmi <br /> kengligi {flowers?.width} <br /> uzunligi {flowers?.height}</p>
                                    </div>
                                    <h1 className="mt-4">{flowers?.description}</h1>
                                    <h1 className="mt-4">{flowers?.description2}</h1>
                                </div>
                            </div>
                        </div>
                        <Comments flowerId={id} />
                    </div>
            }
        </div>
    );
}

export default FlowersInfo;
