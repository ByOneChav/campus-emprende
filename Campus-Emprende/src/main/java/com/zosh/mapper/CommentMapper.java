package com.zosh.mapper;

import com.zosh.model.Comment;
import com.zosh.payload.response.CommentResponse;

import java.util.List;
import java.util.stream.Collectors;

public class CommentMapper {

    public static CommentResponse toResponse(Comment c) {
        CommentResponse res = new CommentResponse();
        res.setId(c.getId());
        res.setServiceId(c.getService().getId());
        res.setAuthorId(c.getAuthor().getId());
        res.setAuthorName(c.getAuthor().getFullName());
        res.setContent(c.getContent());
        res.setCreatedAt(c.getCreatedAt());
        return res;
    }

    public static List<CommentResponse> toResponseList(List<Comment> list) {
        return list.stream().map(CommentMapper::toResponse).collect(Collectors.toList());
    }
}
