export const countPhotosInAlbum = ({ picures }, userId) => {
    return picures.reduce((photosInAlbum, photo) => {
        if (photo.isApproved == '1' || photo.added_by == userId) {
            return ++photosInAlbum
        }

        return photosInAlbum
    }, 0)

}