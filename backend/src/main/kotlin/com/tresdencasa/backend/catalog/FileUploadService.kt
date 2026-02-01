package com.tresdencasa.backend.catalog

import com.cloudinary.Cloudinary
import com.cloudinary.utils.ObjectUtils
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile

/** Servicio para subida de archivos a Cloudinary. */
@Service
class FileUploadService(private val cloudinary: Cloudinary) {

    /**
     * Sube una imagen a Cloudinary y retorna la URL segura.
     *
     * @param file Archivo de imagen a subir
     * @return URL segura de la imagen subida
     */
    fun uploadImage(file: MultipartFile): String {
        val uploadOptions =
                ObjectUtils.asMap("folder", "3dencasa/products", "resource_type", "image")

        val result = cloudinary.uploader().upload(file.bytes, uploadOptions)

        return result["secure_url"] as String
    }
}
