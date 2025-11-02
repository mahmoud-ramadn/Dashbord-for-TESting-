/* eslint-disable react-hooks/rules-of-hooks */
import { useParams } from "react-router"

import Loader from "@/components/ui/loader"

import QuestionsListing from "@/components/questions/listing"
import QuestionUpload from "@/components/questions/upload"
import { useCategory } from "@/hooks/categories"

export default function ViewCategory() {
    const { id } = useParams()

    if (!id) {
        return <div>لا يوجد تصنيف</div>
    }

    const { value: category, loading } = useCategory(id)

    return (
        <div className="container mb-10">
            <h1 className="text-2xl mt-4 font-semibold">عرض التصنيف</h1>

            {loading && <Loader className="size-8 mx-auto" />}

            {Boolean(category) && (
                <div className="grid grid-cols-1 mt-8 md:grid-cols-2 gap-6 px-4">
                    <div>
                        <h2>الاسم العربي</h2>
                        <p className="font-semibold text-lg">{category?.arName}</p>
                    </div>
                    <div>
                        <h2>الاسم الانجليزي</h2>
                        <p className="font-semibold text-lg">{category?.enName}</p>
                    </div>
                    <div>
                        <h2>المجموعة</h2>
                        <p className="font-medium">
                            {category?.group?.arName || <span className="text-gray-400">غير محدد</span>}
                        </p>
                    </div>
                    <div className="flex flex-col ">
                        <h2>الصورة</h2>
                        {category?.photo ? (
                            <img
                                src={category?.photo}
                                alt={category?.arName}
                                className="size-24 rounded-md object-cover border mt-2 shadow"
                            />
                        ) : (
                            <div className="flex flex-col items-center mt-2">
                                <span className="text-gray-400">لا يوجد صورة</span>
                            </div>
                        )}
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <h2>الوصف</h2>
                        <p className="mt-1">
                            {category?.description && category?.description !== "" ? (
                                category?.description
                            ) : (
                                <span className="text-gray-400">لا يوجد وصف</span>
                            )}
                        </p>
                    </div>
                </div>
            )}

            {Boolean(category) && (
                <>
                    <hr className="border-gray-200 my-10" />
                    <QuestionUpload className="mt-6" categoryId={id} />
                    <QuestionsListing className="mt-12" category={category} />
                </>
            )}
        </div>
    )
}
