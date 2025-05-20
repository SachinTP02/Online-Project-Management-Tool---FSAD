package com.fsad.opm.controller;

import com.fsad.opm.model.FileMetadata;
import com.fsad.opm.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileService;

    @PostMapping("/upload")
    public ResponseEntity<FileMetadata> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("username") String username) throws IOException {
        return ResponseEntity.ok(fileService.storeFile(file, username));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ByteArrayResource> downloadFile(@PathVariable Long id) throws IOException {
        FileMetadata metadata = fileService.getFile(id);
        byte[] data = fileService.getFileContent(metadata);

        ByteArrayResource resource = new ByteArrayResource(data);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + metadata.getFileName())
                .contentType(MediaType.parseMediaType(metadata.getFileType()))
                .body(resource);
    }

    @GetMapping
    public ResponseEntity<List<FileMetadata>> listAllFiles() {
        return ResponseEntity.ok(fileService.getAllFiles());
    }
}
