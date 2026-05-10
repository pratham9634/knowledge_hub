import api from "@/lib/axios"


export const uploadImage =
  async (file: File) => {

    const formData =
      new FormData()

    formData.append(
      "file",
      file
    )

    const response =
      await api.post(
        "/uploads/image",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      )

    return response.data
}



export const uploadVideo =
  async (file: File) => {

    const formData =
      new FormData()

    formData.append(
      "file",
      file
    )

    const response =
      await api.post(
        "/uploads/video",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      )

    return response.data
}



export const uploadFile =
  async (file: File) => {

    const formData =
      new FormData()

    formData.append(
      "file",
      file
    )

    const response =
      await api.post(
        "/uploads/file",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      )

    return response.data
}