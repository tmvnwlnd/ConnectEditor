/*
 * $Header: $
 * 
 * ==============================================
 * Copyright (C) 2026 Quo Vide B.V.
 * See: http://www.quovide.com/copyright.html 
 * ==============================================
 *  
 * Created on 24 Feb 2026 by jeroen.deken
 */
package com.quovide.project.kpn.partner_newsroom.core.model.editor;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import lombok.Getter;
import lombok.Setter;

/**
 * 
 * @author <a href="mailto:jeroen.deken@quovide.com">jeroen.deken</a>
 * @version $Id: $
 */
@Getter
@Setter
public class EditorPublication
{

    private String title;

    private List<EditorBlockSection> sections = new ArrayList<>();

    private Set<EditorTextBlock> textBlocks = new HashSet<>();
    private Set<EditorDescriptionBlock> descriptionBlocks = new HashSet<>();
    private Set<EditorImageBlock> imageBlocks = new HashSet<>();
    private Set<EditorCarouselBlock> carouselBlocks = new HashSet<>();
    private Set<EditorTableBlock> tableBlocks = new HashSet<>();
    private Set<EditorVideoBlock> videoBlocks = new HashSet<>();
    private Set<EditorAudioBlock> audioBlocks = new HashSet<>();
    private Set<TextImageBlock> textImageBlocks = new HashSet<>();

}
