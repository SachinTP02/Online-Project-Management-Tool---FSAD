@Entity
@Table(name = "task_attachments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskAttachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String attachmentName;
    private String attachmentType;

    @Lob
    private byte[] attachment;

    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;
}
